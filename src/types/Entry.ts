export type Entry<T> = T & {
    _id: string,
    _ts: number,
}