import {randomBytes} from 'crypto';
import {CC, ID, Prefix} from './types';

const DELIMITER = ':';
const REGEX_VOWELS = /AEIOU/ig;
const PREFIX_LENGTH = 3;
const ID_LENGTH = 11;
const ALPHABET = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

/**
 *
 * @param name
 */
const factory = (name: string) => {
    const MAP = {};

    for (let i = 0; i < ALPHABET.length; i++) {
        MAP[ALPHABET[i]] = i;
    }

    /**
     *
     */
    const random = (): ID => {
        let string = '';

        while (string.length < ID_LENGTH) {
            string += randomBytes(ID_LENGTH)
                .toString('base64')
                .replace(/\W/g, '')
            ;
        }

        return string.slice(0, ID_LENGTH) as ID;
    };

    /**
     *
     * @param string
     */
    const split = (string: string): { prefix: Prefix, cc: CC, id: ID } => {
        const index = string.indexOf(DELIMITER);

        return {
            prefix: string.slice(0, index) as Prefix,
            cc: string.slice(index + 1, index + PREFIX_LENGTH) as CC,
            id: string.slice(index + PREFIX_LENGTH - string.length) as ID,
        };
    };

    /**
     *
     * @param string
     */
    const tokenize = (string: string): Prefix => (
        string.replace(REGEX_VOWELS, '')
            .split('')
            .filter((c, i, array) => array.indexOf(c) === i)
            .join('')
            .slice(0, PREFIX_LENGTH) as Prefix
    );

    /**
     *
     * @param string
     */
    const convert = (string: Prefix | ID): string => {
        let decoded = '';
        let len = string.length;

        while (len-- && MAP[string[len]]) {
            decoded += MAP[string[len]];
        }

        return decoded;
    };

    /**
     *
     * @param string
     */
    const compute = (string: string): CC => {
        let remainder = string;
        let block;

        while (remainder.length > 2) {
            block = remainder.slice(0, 9);
            remainder = ~~block % 97 + remainder.slice(block.length);
        }

        const value = ~~remainder % 97;

        return `0${value}`.slice(-2) as CC;
    };

    /**
     *
     */
    const generate = (): string => {
        const prefix = tokenize(name);
        const id = random();
        const src = convert(prefix) + convert(id);
        const cc = compute(src);

        return `${prefix}${DELIMITER}${cc}${id}`;
    };

    /**
     *
     * @param string
     */
    const validate = (string: string): boolean => {
        const {prefix, id, cc} = split(string);

        if (tokenize(name) !== prefix) {
            return false;
        }

        const src = convert(prefix) + convert(id);

        return compute(src) === cc;
    };

    return {
        generate,
        validate,
    };
};

/**
 * User: Oleg Kamlowski <oleg.kamlowski@thomann.de>
 * Date: 09.11.2021
 * Time: 17:27
 */
export default factory;
