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