import creator from './creator';
import {hasProperty, isEmpty, timestamp} from './utils';
import type {Adapter} from './adapters';
import type {Query} from './query';
import type {Change, Event, Listener, Options} from './eventListener';

export type Collection<T> = {
    add(item: Partial<T>): string,
    read(): Promise<void>,
    write(): Promise<Data<T>>,
    all(): T[],
    count(): number,
    get(id: string): Entry<T>,
    update(id: string, update: Partial<T>): boolean | T,
    remove(id: string),
    query(): Query<T>,
    validate(id: string): boolean,
    reset(),
    on(event: Event, listener: Listener<T>, options?: Options): () => void,
    off(event: Event, listener: Listener<T>): boolean,
}

export type Config = {
    adapter: Adapter,
};

export type Data<T> = {
    name?: string,
    schema?: T,
    entries?: Entry<T>[],
    timestamp?: number,
};

export type Entry<T> = T & {
    _id: string,
    _ts: number,
};

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
    const {adapter} = config;
    const {generate, validate} = creator('id')(name);
    const {emit, on, off} = creator('event')<T>();

    /**
     *
     */
    const read = async (): Promise<void> => {
        const loaded = await adapter.read(name);

        if (!loaded) {
            return;
        }

        data = adapter.deserialize(loaded);
    };

    /**
     *
     */
    const write = async (): Promise<Data<T>> => {
        const serialized = adapter.serialize(data);
        await adapter.write(name, serialized);

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
            _id: generate(),
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
        if (!validate(id)) {
            return undefined;
        }

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
    const update = (id: string, update: Partial<T>): boolean | Entry<T> => {
        if (!validate(id)) {
            return false;
        }

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
        if (!validate(id)) {
            return false;
        }

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
        creator('query')<T>(data.entries)
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
