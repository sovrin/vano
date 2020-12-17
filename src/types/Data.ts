import {Entry} from "./Entry";

export type Data<T> = {
    name?: string,
    schema?: T,
    entries?: Array<Entry<T>>,
    timestamp?: number
};