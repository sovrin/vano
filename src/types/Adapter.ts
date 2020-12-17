export type Adapter = {
    read(key: string): Promise<object>,
    write(key: string, data: object): Promise<void>,
    serialize(data: object),
    deserialize(string: string),
}