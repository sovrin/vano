import assert from "assert";
import {unlinkSync} from 'fs';
import {file} from '../../src';

describe('adapter', () => {
    describe('file', () => {

        before(() => {
            try {
                unlinkSync(__dirname + '/non-existent.json');
                unlinkSync(__dirname + '/bar.json');
            } catch (e) {
                //
            }
        });

        const adapter = file(__dirname);

        it('should read file', async () => {
            const {foo} = await adapter.read('foo') as any;

            assert(foo === 'bar');
        });

        it('should not be not loadable', async () => {
            const data = await adapter.read('unknown') as any;

            assert(data === null);
        });

        it('should write new file', async () => {
            await adapter.write('bar', {'fiz': 'buzz'});
            const {fiz} = await adapter.read('bar') as any;

            assert(fiz === 'buzz');
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