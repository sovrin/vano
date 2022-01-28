import {hasProperty, isNumber, isRegexp} from './utils';
import type {Entry} from './collection';

export type Query<T> = {
    eq<K extends keyof T>(key: K, value: T[K] | RegExp): Query<T>,
    neq<K extends keyof T>(key: K, value: T[K] | RegExp): Query<T>,
    gt<K extends keyof T>(key: K, value: T[K]): Query<T>,
    gte<K extends keyof T>(key: K, value: T[K]): Query<T>,
    lt<K extends keyof T>(key: K, value: T[K]): Query<T>,
    lte<K extends keyof T>(key: K, value: T[K]): Query<T>,
    skip(n: number): Query<T>,
    limit(n: number): Query<T>,
    get(): Entry<T>[],
}

/**
 *
 * @param entries
 */
const factory = <T>(entries: Array<Entry<T>>): Query<T> => {
    type Key = keyof T;

    const state = {
        skip: 0,
        limit: entries.length,
    };

    /**
     *
     * @param fn
     */
    const apply = (fn) => {
        entries = entries.filter(fn);

        return context();
    };

    /**
     *
     */
    const context = (): Query<T> => ({
        eq,
        neq,
        gt,
        gte,
        lt,
        lte,
        skip,
        limit,
        get,
    });

    /**
     *
     * @param key
     * @param value
     */
    const eq = (key: Key, value): Query<T> => apply((entry) => {
        if (hasProperty(entry, key)) {
            if (isRegexp(value)) {
                return entry[key].match(value) !== null;
            }

            return entry[key] === value;
        }

        return false;
    });

    /**
     *
     * @param key
     * @param value
     */
    const neq = (key: Key, value): Query<T> => apply((entry) => {
        if (hasProperty(entry, key)) {
            if (isRegexp(value)) {
                return entry[key].match(value) === null;
            }

            return entry[key] !== value;
        }

        return true;
    });

    /**
     *
     * @param key
     * @param value
     */
    const gt = (key: Key, value): Query<T> => apply((entry) => {
        if (hasProperty(entry, key)) {
            const cursor = entry[key];

            if (isNumber(cursor)) {
                return cursor > value;
            }
        }

        return false;
    });

    /**
     *
     * @param key
     * @param value
     */
    const gte = (key: Key, value): Query<T> => apply((entry) => {
        if (hasProperty(entry, key)) {
            const cursor = entry[key];

            if (isNumber(cursor)) {
                return cursor >= value;
            }
        }

        return false;
    });

    /**
     *
     * @param key
     * @param value
     */
    const lt = (key: Key, value): Query<T> => apply((entry) => {
        if (hasProperty(entry, key)) {
            const cursor = entry[key];

            if (isNumber(cursor)) {
                return cursor < value;
            }
        }

        return false;
    });

    /**
     *
     * @param key
     * @param value
     */
    const lte = (key: Key, value): Query<T> => apply((entry) => {
        if (hasProperty(entry, key)) {
            const cursor = entry[key];

            if (isNumber(cursor)) {
                return cursor <= value;
            }
        }

        return false;
    });

    /**
     *
     * @param n
     */
    const skip = (n: number): Query<T> => {
        state.skip = n;

        return context();
    };

    /**
     *
     * @param n
     */
    const limit = (n: number): Query<T> => {
        state.limit = n;

        return context();
    };

    /**
     *
     */
    const get = (): Array<Entry<T>> => {
        const {skip, limit} = state;
        const {length} = entries;

        if (skip > 0 && skip < length) {
            entries = entries.slice(skip, length);
        }

        if (limit > 0 && limit < length) {
            entries = entries.slice(0, limit);
        }

        return entries;
    };

    return context();
};

/**
 * User: Oleg Kamlowski <oleg.kamlowski@thomann.de>
 * Date: 29.09.2020
 * Time: 20:44
 */
export default factory;
