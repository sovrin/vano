import event from './eventListener';
import query from './query';
import id from './id';

type FactoryTypes = typeof factories;
type Keys = keyof FactoryTypes;
type Factory<K extends Keys> = FactoryTypes[K];

const factories = {
    event,
    query,
    id,
};

/**
 *
 * @param k
 */
const factory = <K extends Keys>(k: K): Factory<K> => (
    factories[k]
);

/**
 * User: Oleg Kamlowski <oleg.kamlowski@thomann.de>
 * Date: 28.01.2022
 * Time: 16:38
 */
export default factory;
