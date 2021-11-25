/**
 *
 * @param object
 * @param key
 */
export const hasProperty = <T>(object: unknown, key: keyof T): boolean => (
    object.hasOwnProperty(key)
);

/**
 *
 * @param value
 */
export const isNumber = (value: unknown): boolean => (
    typeof value === "number"
);

/**
 *
 * @param value
 */
export const isRegexp = (value: unknown): boolean => (
    value instanceof RegExp
);

/**
 *
 * @param object
 */
export const isEmpty = (object: unknown): boolean => (
    !object || (object.constructor === Object && Object.keys(object).length === 0)
);

/**
 *
 */
export const timestamp = (): number => (
    new Date().getTime()
);
