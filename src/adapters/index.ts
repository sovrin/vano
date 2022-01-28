export * from './file';
export * from './memory';

export type Adapter = {
    read(key: string): Promise<string>,
    write(key: string, data: string): Promise<void>,
    serialize(data: object),
    deserialize(data: unknown),
}
