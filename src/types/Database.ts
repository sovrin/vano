import {Collection} from "./Collection";

export type Database = {
    collection<T>(name: string, schema?: T): Collection<T>;
};