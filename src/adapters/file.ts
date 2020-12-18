import {resolve} from 'path';
import {existsSync, readFile, writeFile} from 'fs';
import {promisify} from 'util';
import {Adapter} from "../types";

const load = promisify(readFile);
const save = promisify(writeFile);

/**
 *
 * @param root
 */
const factory = (root: string): Adapter => {

    /**
     *
     * @param data
     */
    const serialize = (data: any) => (
        data && JSON.stringify(data)
    );

    /**
     *
     * @param data
     */
    const deserialize = (data: string) => (
        data && JSON.parse(data)
    );

    /**
     *
     * @param key
     */
    const read = async (key: string): Promise<object> => {
        const pointer = resolve(root, key);

        if (!existsSync(pointer)) {
            return null;
        }

        const data = await load(pointer, 'utf-8');
        const trimmed = data.trim();

        return deserialize(trimmed);
    }

    /**
     *
     * @param key
     * @param data
     */
    const write = async (key: string, data: object): Promise<void> => {
        const pointer = resolve(root, key);
        const string = serialize(data);

        await save(pointer, string);
    }

    return {
        serialize,
        deserialize,
        read,
        write
    }
};

/**
 * User: Oleg Kamlowski <oleg.kamlowski@thomann.de>
 * Date: 25.09.2020
 * Time: 19:55
 */
export const file = factory;