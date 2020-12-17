import assert from "assert";
import {memory} from '../../src';
import {equals} from "../utils";

describe('database', () => {
    describe('adapter', () => {
        describe('memory', () => {
            const adapter = memory();

            it('should return undefined', async () => {
                const bar = await adapter.read('bar');

                assert(bar === undefined);
            });

            it('should write', async () => {
                const data = {foo: 'bar'};
                await adapter.write('foo', data);

                const value = await adapter.read('foo');

                assert(equals(value, data));
            });

            it('should serialize data', () => {
                const serialized = adapter.serialize({foo: 'bar'})

                assert(serialized === "{\"foo\":\"bar\"}");
            });

            it('should deserialize data', () => {
                const {foo} = adapter.deserialize("{\"foo\":\"bar\"}")

                assert(foo === 'bar');
            });
        });
    });
});