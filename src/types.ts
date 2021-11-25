export type Adapter = {
    read(key: string): Promise<string>,
    write(key: string, data: string): Promise<void>,
    serialize(data: any),
    deserialize(data: any),
}

export type Collection<T> = {
    add(item: Partial<T>): string,
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
    eq<K extends keyof T>(key: K, value: T[K] | RegExp): Query<T>,
    neq<K extends keyof T>(key: K, value: T[K] | RegExp): Query<T>,
    gt<K extends keyof T>(key: K, value: T[K]): Query<T>,
    gte<K extends keyof T>(key: K, value: T[K]): Query<T>,
    lt<K extends keyof T>(key: K, value: T[K]): Query<T>,
    lte<K extends keyof T>(key: K, value: T[K]): Query<T>,
    skip(n: number): Query<T>,
    limit(n: number): Query<T>,
    get(): Array<T>,
}
