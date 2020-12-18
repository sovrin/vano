import assert from "assert";
import database from '../src/database';
import {memory} from '../src';
import collection from "../src/collection";

describe('database', () => {
    const schema = {
        name: ""
    }

    const adapter = memory();

    it('should not create an instance given an invalid collection name', () => {
        const instance = database({adapter});

        assert.throws(() => instance.collection(' \n\r!"§$%&/()=?foo123\v'), {
            message: `collection name can only be alphanumeric.`
        })
    });

    it('should create several distinct collections', () => {
        const instance = database({adapter});

        const foo = instance.collection('foo');
        const bar = instance.collection('bar');

        assert(foo !== bar);
    });

    it('should create distinct entries', () => {
        const instance = database({adapter});
        const entry = {
            name: "entry"
        }

        const foo = instance.collection('foo');
        const fooId = foo.add(entry);

        const bar = instance.collection('bar');
        const barId = bar.add(entry);

        const fooEntry = foo.get(fooId);
        const barEntry = bar.get(barId);

        assert(foo !== bar);
        assert(fooEntry !== barEntry);
    });

    it('should not create a new collection with the same key', async () => {
        const instance = await database({adapter});

        const a = instance.collection('foo', schema);
        const b = instance.collection('foo');

        assert(a === b);
    });
});