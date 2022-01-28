import assert from 'assert';
import collection from '../src/collection';
import {memory} from '../src';
import {equals} from './utils';

describe('collection', () => {
    const entry = {
        '_id': 'f:31V4bFBL4e0M6',
        '_ts': 1601386379613,
        'string': 'bar',
        'number': 3,
    };

    const schema = {
        'string': '',
        'number': 0,
        'boolean': true,
        'default': 'secret',
    };

    const state: any = {
        'name': 'foo',
        'schema': schema,
        'entries': [
            entry,
        ],
    };

    const adapter = memory();
    adapter.write('foo', state);

    it('should create an instance of collection', async () => {
        const instance = await collection('foo', null, {adapter});
        const expected = [
            'add',
            'read',
            'write',
            'all',
            'count',
            'get',
            'update',
            'remove',
            'query',
            'reset',
            'validate',
            'on',
            'off',
        ];

        const actual = Object.keys(instance);

        assert(equals(expected, actual));
    });

    it('should not be able to load unknown collection', async () => {
        const instance = collection('unknown', null, {adapter});
        await instance.read();
        const value = instance.get('foo');

        assert(value === undefined);
    });

    it('should read collection and get value', async () => {
        const instance = await collection('foo', schema, {adapter});
        await instance.read();

        const value = instance.get('f:31V4bFBL4e0M6');

        assert(equals(value, entry));
    });

    it('should get nothing', async () => {
        const instance = collection('unknown', null, {adapter});

        const value = instance.get('foo');

        assert(value === undefined);
    });

    it('should read collection and get nothing', async () => {
        const instance = await collection('foo', null, {adapter});
        await instance.read();

        const value = instance.get('foo');

        assert(value === undefined);
    });

    it('should add an array and get from collection while ignoring schema', async () => {
        const instance = await collection('foo', null, {adapter});
        await instance.read();

        const id = instance.add(['yeet']);
        const entry = instance.get(id);

        assert(entry[0] === 'yeet');
    });

    it('should add an object and get from collection while ignoring schema', async () => {
        const instance = await collection('foo', null, {adapter});
        await instance.read();

        const id = instance.add({foo: 'bar'});
        const {foo} = instance.get(id);

        assert(foo === 'bar');
    });

    it('should not mutate input data', async () => {
        const instance = await collection('foo', null, {adapter});
        await instance.read();

        const entry = {foo: 'bar'} as any;
        const id = instance.add(entry);
        const value = instance.get(id);

        assert(entry !== value);
        assert(entry._id === undefined);
        assert(entry._ts === undefined);
    });

    it('should add and get value from collection while adhering schema', async () => {
        const instance = await collection('foo', schema, {adapter});
        await instance.read();

        const id = instance.add({
            foo: 'bar',
            fiz: 2,
            string: 'string',
            number: 9000,
        } as any);

        const entry = instance.get(id) as any;
        const expected = ['_id', '_ts', 'string', 'number', 'boolean', 'default'];
        const actual = Object.keys(entry);

        assert(equals(expected, actual));
        assert(typeof entry._id === 'string');
        assert(typeof entry._ts === 'number');
        assert(entry.foo === undefined);
        assert(entry.string === 'string');
        assert(entry.number === 9000);
        assert(entry.boolean === true);
        assert(entry.default === 'secret');
    });

    it('should add value and trigger event', (done) => {
        const instance = collection('foo', schema, {adapter});

        instance.on('add', (data) => {
            assert(data.entry.string === 'foobar');
            assert(data.event === 'add');
            done();
        });

        instance.add({
            string: 'foobar',
        });
    });

    it('should return count of collections', async () => {
        const instance = await collection('foo', null, {adapter});
        await instance.read();

        const count = instance.count();

        assert(count === 5);
    });

    it('should return new count of collections after add', async () => {
        const instance = await collection('foo', null, {adapter});
        await instance.read();

        assert(instance.count() === 5);

        instance.add({string: 'test'});

        assert(instance.count() === 6);
    });

    it('should update entry', async () => {
        const instance = await collection('foo', schema, {adapter});
        await instance.read();

        const changed = instance.update('f:31V4bFBL4e0M6', {
            'string': 'sauce',
            // @ts-ignore
            'foo': 'bar',
        }) as any;

        assert(changed.string === 'sauce');
        assert(changed.number === 3);
        assert(changed.foo === undefined);
    });

    it('should not update entry by correct id but unknown field', async () => {
        const instance = await collection('foo', null, {adapter});
        await instance.read();

        const changed = instance.update('f:85ntVEk9RP2dd', {
            'foo': 'bar',
        }) as any;

        assert(changed === false);
    });

    it('should not update entry by unknown id', async () => {
        const instance = await collection('foo', null, {adapter});
        await instance.read();

        {
            const changed = instance.update('foo', {
                'foo': 'bar',
            }) as any;

            assert(changed === false);
        }

        {
            const changed = instance.update('f:31V4bFBL4e0M6', {
                'foo': 'bar',
            }) as any;

            assert(changed === false);
        }
    });

    it('should update and trigger event', (done) => {
        const instance = collection('foo', schema, {adapter});
        instance.read().then(() => {
            const id = instance.add({
                string: 'foo',
            });

            instance.on('update', ({changes}) => {
                assert(changes.length === 1);
                const [change] = changes;

                const {field, before, after} = change;
                assert(field === 'string');
                assert(before === 'foo');
                assert(after === 'bar');

                done();
            });

            instance.update(id, {
                string: 'bar',
            });
        })
    });

    it('should remove entry by correct id', async () => {
        const instance = await collection('foo', null, {adapter});
        await instance.read();

        const changed = instance.remove('f:31V4bFBL4e0M6');

        assert(changed === true);
    });

    it('should not remove entry by unknown id', async () => {
        const instance = await collection('foo', null, {adapter});
        await instance.read();

        {
            const changed = instance.remove('foo');

            assert(changed === false);
        }

        {
            const changed = instance.remove('f:31V4bFBL4e0M6');

            assert(changed === false);
        }
    });

    it('should remove entry and trigger event', (done) => {
        const instance = collection('foo', schema, {adapter});

        instance.read().then(() => {
            const id = instance.add({
                string: 'foo',
            });

            instance.on('remove', (data) => {
                assert(data.entry._id === id);
                assert(data.entry.string === 'foo');

                done();
            });

            instance.remove(id);
        });
    });

    it('should write collection', async () => {
        const instance = await collection('foo', null, {adapter});
        await instance.read();

        const data = await instance.write();

        assert(equals(data, state));
    });

    it('should return complete collection', async () => {
        const instance = await collection('foo', null, {adapter});
        await instance.read();

        const count = instance.count();
        const entries = instance.all();

        assert(entries.length === count);
    });

    it('should reset collection', async () => {
        const instance = await collection('foo', null, {adapter});
        await instance.read();

        const oldCount = instance.count();

        instance.reset();

        const newCount = instance.count();

        assert(oldCount > newCount);
        assert(newCount === 0);
    });

    it('should return query builder', async () => {
        const instance = await collection('foo', null, {adapter});

        const builder = instance.query();

        assert(builder !== undefined);
    });
});
