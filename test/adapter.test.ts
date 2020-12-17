import base from '../src/adapter';
import assert from "assert";
import {equals} from "./utils";

describe('adapter', () => {
    const adapter = base();

    it('should (pseudo) write', async () => {
        const data = {foo: 'bar'};
        await adapter.write('foo', data);
        const value = await adapter.read('foo');

        assert(!equals(value, data));
        assert(!equals(value, {}));
    });

    it('should serialize data', () => {
        const serialized = adapter.serialize({foo: 'bar'})

        assert(serialized, "{\"foo\":\"bar\"}");
    })

    it('should deserialize data', () => {
        const {foo} = adapter.deserialize("{\"foo\":\"bar\"}")

        assert(foo, 'bar');
    })
});