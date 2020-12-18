import queryFactory from './query';
import {hasProperty, isEmpty, timestamp, unique} from "./utils";
import {Config, Query, Collection, Data, Entry} from "./types";

/**
 *
 * @param name
 * @param schema
 * @param config
 */
const factory = <T>(name: string, schema: T, config: Config): Collection<T> => {
    let data: Data<T> = {
        name,
        schema,
        entries: [],
        timestamp: timestamp(),
    };

    const {adapter, ext} = {
        ext: 'json',
        ...config,
    };

    /**
     *
     */
    const read = async (): Promise<void> => {
        const parts = [name, ext];
        const cursor = parts.filter(Boolean)
            .join('.')
        ;

        const loaded = await adapter.read(cursor);

        if (!loaded) {
            return;
        }

        data = loaded;
    };

    /**
     *
     */
    const write = async (): Promise<Data<T>> => {
        const cursor = `${name}.${ext}`;
        await adapter.write(cursor, data);

        return data;
    };

    /**
     *
     * @param entry
     */
    const filter = (entry): Entry<T> => {
        const candidate: Entry<T> = {
            _id: '',
            _ts: 0,
            ...schema,
        };

        for (const key of Object.keys(candidate)) {
            const propertyExists = (hasProperty(entry, key));
            const isSameType = (typeof entry[key] === typeof candidate[key]);

            if (propertyExists && isSameType) {
                candidate[key] = entry[key];
            }
        }

        return candidate;
    };

    /**
     *
     * @param item
     */
    const add = (item: T): string => {
        let entry: Entry<T> = {
            _id: unique(),
            _ts: timestamp(),
            ...item,
        };

        if (!isEmpty(schema)) {
            entry = filter(entry);
        }

        data.entries.push(entry);
        data.timestamp = timestamp();

        return entry._id;
    };

    /**
     *
     */
    const all = (): Array<T> => (
        [...data.entries]
    );

    /**
     *
     */
    const count = (): number => (
        data.entries.length
    );

    /**
     *
     * @param id
     */
    const get = (id: string): Entry<T> => {
        const {entries} = data;

        return entries.find(({_id}) => (
            _id === id
        ));
    };

    /**
     *
     * @param id
     * @param update
     */
    const update = (id: string, update): boolean | Entry<T> => {
        let changed = false;

        const index = data.entries.findIndex(({_id}) => (
            _id === id
        ));

        if (index === -1) {
            return false;
        }

        const obj = data.entries[index];

        for (const key of Object.keys(obj)) {
            if (key === '_id' || key === '_ts') {
                continue;
            }

            const propertyExists = (hasProperty(update, key));
            const equalType = (typeof update[key] === typeof obj[key]);
            const notEqualValue = (update[key] !== obj[key]);

            if (propertyExists && equalType && notEqualValue) {
                obj[key] = update[key];

                changed = true;
            }
        }

        if (!changed) {
            return false;
        }

        obj._ts = timestamp();
        data.entries[index] = obj;
        data.timestamp = timestamp();

        return obj;
    };

    /**
     *
     * @param id
     */
    const remove = (id: string): boolean => {
        const {entries} = data;
        const index = entries.findIndex(({_id}) => (
            _id === id
        ));

        if (index === -1) {
            return false;
        }

        entries.splice(index, 1);
        data.entries = entries;
        data.timestamp = timestamp();

        return true;
    };

    /**
     *
     */
    const query = (): Query<T> => (
        queryFactory<T>(data.entries)
    );

    /**
     *
     */
    const reset = async () => {
        data.timestamp = timestamp();
        data.entries = [];
    };

    return {
        add,
        read,
        write,
        all,
        count,
        get,
        update,
        remove,
        query,
        reset,
    };
};

/**
 * User: Oleg Kamlowski <oleg.kamlowski@thomann.de>
 * Date: 30.09.2020
 * Time: 22:02
 */
export default factory;