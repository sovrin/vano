import {Data} from "./Data";
import {Entry} from "./Entry";
import {Query} from "./Query";

export type Collection<T> = {
    add(item): string,
    read(): Promise<void>,
    write(): Promise<Data<T>>,
    all(): Array<T>,
    count(): number,
    get(id: string): Entry<T>,
    update(id: string, data): boolean | T,
    remove(id: string),
    query(): Query<T>,
    reset(),
}