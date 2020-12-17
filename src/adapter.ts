import {Adapter, Data} from "./types";

/**
 *
 */
const factory = (): Adapter => {

    /**
     *
     * @param data
     */
    const serialize = (data: Data<any>) => (
        data && JSON.stringify(data)
    );

    /**
     *
     * @param string
     */
    const deserialize = (string: string) => (
        string && JSON.parse(string)
    );

    /**
     *
     */
    const read = async <T>(): Promise<Data<T>> => (
        Promise.resolve(null)
    );

    /**
     *
     */
    const write = async <T>(): Promise<void> => (
        Promise.resolve(null)
    );

    return {
        serialize,
        deserialize,
        read,
        write,
    };
};

/**
 * User: Oleg Kamlowski <oleg.kamlowski@thomann.de>
 * Date: 25.09.2020
 * Time: 19:47
 */
export default factory;