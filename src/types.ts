export type Adapter = {
    read(key: string): Promise<object>,
    write(key: string, data: object): Promise<void>,
    serialize(data: any),
    deserialize(data: any),
}

export type Collection<T> = {
    add(item: T): string,
    read(): Promise<void>,
    write(): Promise<Data<T>>,
    all(): Array<T>,
    count(): number,
    get(id: string): Entry<T>,
    update(id: string, update: any): boolean | T,
    remove(id: string),
    query(): Query<T>,
    reset(),
}

export type Config = {
    adapter: Adapter,
}

export type Data<T> = {
    name?: string,
    schema?: T,
    entries?: Array<Entry<T>>,
    timestamp?: number
};

export type Database = {
    collection<T>(name: string, schema?: T): Collection<T>;
};

export type Entry<T> = T & {
    _id: string,
    _ts: number,
}

export type Query<T> = {
    eq(key: keyof T, value): Query<T>,
    neq(key: keyof T, value): Query<T>,
    gt(key: keyof T, value): Query<T>,
    gte(key: keyof T, value): Query<T>,
    lt(key: keyof T, value): Query<T>,
    lte(key: keyof T, value): Query<T>,
    skip(n: number): Query<T>,
    limit(n: number): Query<T>,
    get(): Array<T>,
}