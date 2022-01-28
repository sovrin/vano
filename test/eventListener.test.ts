import assert from 'assert';
import eventFactory from '../src/eventListener';

describe('event', () => {
    it('should bind event and unbind again', (done) => {
        const event = eventFactory();

        const unbind = event.on('add', () => {
            done('shouldn\'t be executed');
        });

        unbind();
        event.emit('add', {
            _id: 'foobar',
            _ts: 1,
        });

        // mega ugly
        setTimeout(() => {
            done();
        }, 50);
    });

    it('should bind event and react on emit', (done) => {
        const event = eventFactory();

        event.on('add', (data) => {
            assert(data.entry._id === 'foobar');
            assert(data.entry._ts === 123);
            assert(data.event === 'add');
            done();
        });

        event.emit('add', {
            _id: 'foobar',
            _ts: 123,
        });
    });

    it('should bind event and react on emit once', (done) => {
        const event = eventFactory();
        let count = 0;

        event.on('add', () => {
            ++count;
        }, {once: true});

        event.on('update', () => {
            assert(count === 1);

            done();
        });

        event.emit('add', {
            _id: 'foo',
            _ts: 123,
        });

        event.emit('add', {
            _id: 'bar',
            _ts: 321,
        });

        event.emit('update', {
            _id: 'foobar',
            _ts: 0,
        });
    });
});
