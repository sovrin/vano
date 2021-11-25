import assert from 'assert';
import {unlinkSync} from 'fs';
import {file} from '../../src';

describe('adapter', () => {
    describe('file', () => {

        before(() => {
            try {
                unlinkSync(__dirname + '/bar.json');
            } catch (e) {
                //
            }
        });

        const adapter = file(__dirname);

        it('should read file', async () => {
            const data = await adapter.read('foo') as any;

            assert(data === '{"foo": "bar"}');
        });

        it('should not be not loadable', async () => {
            const data = await adapter.read('unknown') as any;

            assert(data === null);
        });

        it('should write new file', async () => {
            const string = '{"fiz":"buz"}';
            let data = await adapter.read('bar') as any;

            assert(data === null);

            await adapter.write('bar', string);
            data = await adapter.read('bar') as any;

            assert(data === string);
            assert(data.match(/buz/));
        });

        it('should serialize data', () => {
            const serialized = adapter.serialize({foo: 'bar'});

            assert(serialized === '{"foo":"bar"}');
        });

        it('should deserialize data', () => {
            const {foo} = adapter.deserialize('{"foo":"bar"}');

            assert(foo === 'bar');
        });
    });
});
