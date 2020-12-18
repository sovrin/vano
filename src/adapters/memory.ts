import {Adapter} from "../types";

/**
 *
 */
const factory = (): Adapter => {
    const memory = {};

    /**
     *
     * @param data
     */
    const serialize = (data: object) => (
        Object.assign({}, data)
    );

    /**
     *
     * @param data
     */
    const deserialize = (data: any) => (
        Object.assign({}, data)
    );

    /**
     *
     * @param key
     */
    const read = async (key: string): Promise<object> => (
        Promise.resolve(memory[key])
    );

    /**
     *
     */
    const write = async (key: string, data: object): Promise<void> => {
        memory[key] = data;
    };

    return {
        serialize,
        deserialize,
        read,
        write
    };
};

/**
 * User: Oleg Kamlowski <oleg.kamlowski@thomann.de>
 * Date: 25.09.2020
 * Time: 19:55
 */
export const memory = factory;