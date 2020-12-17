import collectionFactory from './collection';
import {Config, Collection, Database} from "./types";

/**
 *
 * @param config
 */
const factory = (config: Config): Database => {
    const collections: Record<string, Collection<any>> = {};

    /**
     *
     * @param name
     * @param schema
     */
    const collection = <T>(name: string, schema: T): Collection<T> => {
        if (!collections[name]) {
            collections[name] = collectionFactory(name, schema, config);
        }

        return collections[name];
    };

    return {
        collection,
    };
};

/**
 * User: Oleg Kamlowski <oleg.kamlowski@thomann.de>
 * Date: 25.09.2020
 * Time: 18:36
 */
export default factory;