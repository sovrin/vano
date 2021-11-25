import assert from 'assert';
import {memory} from '../../src';
import {equals} from '../utils';

describe('adapter', () => {
    describe('memory', () => {
        const adapter = memory();
        const data = {foo: 'bar'};

        it('should return undefined', async () => {
            const bar = await adapter.read('bar');

            assert(bar === undefined);
        });

        it('should write', async () => {
            await adapter.write('foo', data as any);

            const value = await adapter.read('foo');

            assert(equals(value, data));
        });

        it('should serialize data', () => {
            const serialized = adapter.serialize(data);

            assert(serialized !== data);
            assert(equals(serialized, data));
        });

        it('should deserialize data', () => {
            const {foo} = adapter.deserialize(data);

            assert(foo === 'bar');
        });
    });
});
