import {Entry} from './collection';

const Events = [
    'add',
    'update',
    'remove',
] as const;

export type Change<T> = {
    field: keyof T,
    before: unknown,
    after: unknown,
};

export type Event = typeof Events[number];

export type Options = {
    once?: boolean
};

export type Data<T> = {
    entry: Entry<T>,
    event: Event,
    changes?: Change<T>[],
};

export type Listener<T> = (data: Data<T>) => void;

export type EventListener<T> = {
    on(event: Event, listener: Listener<T>, options?: Options): () => void,
    off(event: Event, listener: Listener<T>): boolean,
    emit(event: Event, entry: Entry<T>, changes?: Change<T>[]): void,
};

/**
 *
 */
const factory = <T>(): EventListener<T> => {
    const listeners: Record<Event, Map<Listener<T>, Options>> = {
        add: new Map<Listener<T>, Options>(),
        update: new Map<Listener<T>, Options>(),
        remove: new Map<Listener<T>, Options>(),
    };

    /**
     *
     * @param event
     * @param entry
     * @param changes
     */
    const emit = (event: Event, entry: Entry<T>, changes?: Change<T>[]): void => {
        listeners[event].forEach((options, listener) => {
            listener({
                event,
                entry,
                changes,
            });

            if (options?.once) {
                off(event, listener);
            }
        });
    };

    /**
     *
     * @param event
     * @param listener
     * @param options
     */
    const on = (event: Event, listener: Listener<T>, options?: Options): () => void => {
        listeners[event].set(listener, options);

        return () => {
            off(event, listener);
        };
    };

    /**
     *
     * @param event
     * @param listener
     */
    const off = (event: Event, listener: Listener<T>): boolean => {
        return listeners[event].delete(listener);
    };

    return {
        emit,
        on,
        off,
    };
};

/**
 * User: Oleg Kamlowski <oleg.kamlowski@thomann.de>
 * Date: 27.12.2021
 * Time: 16:56
 */
export default factory;
