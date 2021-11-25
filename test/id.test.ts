import assert from 'assert';
import idFactory from '../src/id';

describe('id', () => {
    it('should generate unique ids', () => {
        const length = 10000;
        const symbol = Symbol();
        const ids = {};
        const instance = idFactory('foo');

        for (let i = 0; i < length; i++) {
            const id = instance.generate();
            ids[id] = symbol;
        }

        assert(Object.keys(ids).length === length);
    });

    it('should validate token', () => {
        const instance = idFactory('f');
        const id = instance.generate();

        assert(instance.validate(id) === true);
    });

    it('should fail', () => {
        const instance = idFactory('f');

        assert(instance.validate('f:test') === false);
        assert(instance.validate('f:00test') === false);
        assert(instance.validate('f:00test_!"§$%&/()=?') === false);
        assert(instance.validate('f:90test') === true);
    });
});
