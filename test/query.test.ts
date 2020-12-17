import assert from "assert";
import query from '../src/query'
import {Entry} from "../src/types";

describe('query', () => {
    const data: Array<Entry<any>> = [
        {
            name: "foo",
            count: 1,
        },
        {
            name: "bar",
            count: 2,
        },
        {
            name: "fiz",
            count: 3,
        },
        {
            name: "buzz",
            count: 4,
        },
    ];

    const schema = {
        name: "",
        count: 0
    };

    it('should find no entries where unknown=bar', () => {
        const instance = query<typeof schema>(data);
        const entries = instance
            .eq("unknown" as any, "bar")
            .get()
        ;

        assert(entries.length === 0);
    });

    it('should find entries where name=bar', () => {
        const instance = query<typeof schema>(data);
        const entries = instance
            .eq("name", "bar")
            .get()
        ;

        const [first] = entries;

        assert(entries.length === 1);
        assert(first.name === "bar");
    });

    it('should find entries where name=/f/', () => {
        const instance = query<typeof schema>(data);
        const entries = instance
            .eq("name", /f/)
            .get()
        ;

        const [first, second] = entries;

        assert(entries.length === 2);
        assert(first.name === "foo");
        assert(second.name === "fiz");
    });

    it('should find no entries where not unknown=bar', () => {
        const instance = query<typeof schema>(data);
        const entries = instance.neq("unknown" as any, "bar")
            .get()
        ;

        assert(entries.length === data.length);
    });

    it('should find entries where not name=bar', () => {
        const instance = query<typeof schema>(data);
        const entries = instance.neq("name", "bar")
            .get()
        ;

        const [first, second, third] = entries;

        assert(entries.length === 3);
        assert(first.name === "foo");
        assert(second.name === "fiz");
        assert(third.name === "buzz");
    });

    it('should find entries where not name=/f/', () => {
        const instance = query<typeof schema>(data);
        const entries = instance.neq("name", /f/)
            .get()
        ;

        const [first, second] = entries;

        assert(entries.length === 2);
        assert(first.name === "bar");
        assert(second.name === "buzz");
    });

    it('should not find gt entries by wrong comparator type', () => {
        const instance = query<typeof schema>(data);
        const entries = instance.gt("name", "oof")
            .get()
        ;

        assert(entries.length === 0);
    });

    it('should find no entries where unknown > 2', () => {
        const instance = query<typeof schema>(data);
        const entries = instance.gt("unknown" as any, 2)
            .get()
        ;

        assert(entries.length === 0);
    });

    it('should find entries where count > 2', () => {
        const instance = query<typeof schema>(data);
        const entries = instance.gt("count", 2)
            .get()
        ;

        const [first, second] = entries;

        assert(entries.length === 2);
        assert(first.count === 3);
        assert(second.count === 4);
    });

    it('should not find gte entries by wrong comparator type', () => {
        const instance = query<typeof schema>(data);
        const entries = instance.gte("name", "foo")
            .get()
        ;

        assert(entries.length === 0);
    });

    it('should find no entries where unknown >= 2', () => {
        const instance = query<typeof schema>(data);
        const entries = instance.gte("unknown" as any, 2)
            .get()
        ;

        assert(entries.length === 0);
    });

    it('should find entries where count >= 2', () => {
        const instance = query<typeof schema>(data);
        const entries = instance.gte("count", 2)
            .get()
        ;

        const [first, second, third] = entries;

        assert(entries.length === 3);
        assert(first.count === 2);
        assert(second.count === 3);
        assert(third.count === 4);
    });

    it('should not find lt entries by wrong comparator type', () => {
        const instance = query<typeof schema>(data);
        const entries = instance.lt("name", "foo")
            .get()
        ;

        assert(entries.length === 0);
    });

    it('should find no entries where unknown < 2', () => {
        const instance = query<typeof schema>(data);
        const entries = instance.lt("unknown" as any, 2)
            .get()
        ;

        assert(entries.length === 0);
    });

    it('should find entries where count < 2', () => {
        const instance = query<typeof schema>(data);
        const entries = instance.lt("count", 2)
            .get()
        ;

        const [first] = entries;

        assert(entries.length === 1);
        assert(first.count === 1);
    });

    it('should not find lte entries by wrong comparator type', () => {
        const instance = query<typeof schema>(data);
        const entries = instance.lte("name", "foo")
            .get()
        ;

        assert(entries.length === 0);
    });

    it('should find no entries where unknown <= 2', () => {
        const instance = query<typeof schema>(data);
        const entries = instance.lte("unknown" as any, 2)
            .get()
        ;

        assert(entries.length === 0);
    });

    it('should find entries where count <= 2', () => {
        const instance = query<typeof schema>(data);
        const entries = instance.lte("count", 2)
            .get()
        ;

        const [first, second] = entries;

        assert(entries.length === 2);
        assert(first.count === 1);
        assert(second.count === 2);
    });

    it('should find entries where count >= 0 and skip 2', () => {
        const instance = query<typeof schema>(data);
        const entries = instance.gte("count", 0)
            .skip(2)
            .get()
        ;

        const [third, fourth] = entries;

        assert(entries.length === 2);
        assert(third.name === "fiz");
        assert(fourth.name === "buzz");
    });

    it('should find entries where count >= 0 and limit 2', () => {
        const instance = query<typeof schema>(data);
        const entries = instance.gte("count", 0)
            .limit(2)
            .get()
        ;

        const [first, second] = entries;

        assert(entries.length === 2);
        assert(first.name === "foo");
        assert(second.name === "bar");
    });
});