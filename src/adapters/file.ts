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
        const pointer = resolve(root, `${key}.json`);
    const read = async (key: string): Promise<string> => {

        if (!existsSync(pointer)) {
            return null;
        }

        return (await load(cursor, 'utf-8')).trim();
    }

    /**
     *
     * @param key
     * @param data
     */
    const write = async (key: string, data: string): Promise<void> => {
        const pointer = resolve(base, `${key}.json`);

        await save(pointer, data);
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