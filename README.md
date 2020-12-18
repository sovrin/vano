<h1 align="left">vano</h1>

[![npm version][npm-src]][npm-href]
[![types][types-src]][types-href]
[![size][size-src]][size-href]
[![coverage][coverage-src]][coverage-href]
[![vulnerabilities][vulnerabilities-src]][vulnerabilities-href]
[![dependencies][dep-src]][dep-href]
[![devDependencies][devDep-src]][devDep-href]
[![License][license-src]][license-href]

> small and flexible collection storage library suitable for small projects.

## Installation
```bash
$ npm i vano
```

## Usage
```js
import vano, {file} from 'vano';

(async () => {
    const db = vano({adapter: file('./storage')});

    const characters = db.collection('characters', {
        name: '',
        age: 0,
    });
    
    characters.add({name: "john doe", age: 30});

    await characters.write();
})()
```

## API
- <a href="#ctor"><code><b>vano(config)</b></code></a>
- <a href="#adapterFile"><code><b>file(base)</b></code></a>
- <a href="#adapterMemory"><code><b>memory()</b></code></a>
- <a href="#col"><code>db<b>.collection(name[, schema])</b></code></a>
- <a href="#colRead"><code>col.<b>read()</b></code></a>
- <a href="#colWrite"><code>col.<b>write()</b></code></a>
- <a href="#colAdd"><code>col.<b>add(item)</b></code></a>
- <a href="#colAll"><code>col.<b>all()</b></code></a>
- <a href="#colCount"><code>col.<b>count()</b></code></a>
- <a href="#colGet"><code>col.<b>get(id)</b></code></a>
- <a href="#colRemove"><code>col.<b>remove(id)</b></code></a>
- <a href="#colUpdate"><code>col.<b>update(id, update)</b></code></a>
- <a href="#colQuery"><code>col.<b>query()</b></code></a>
- <a href="#colReset"><code>col.<b>reset()</b></code></a>
- <a href="#queryEq"><code>query.<b>eq(key, value)</b></code></a>
- <a href="#queryNeq"><code>query.<b>neq(key, value)</b></code></a>
- <a href="#queryGt"><code>query.<b>gt(key, value)</b></code></a>
- <a href="#queryGte"><code>query.<b>gte(key, value)</b></code></a>
- <a href="#queryLt"><code>query.<b>lt(key, value)</b></code></a>
- <a href="#queryLte"><code>query.<b>lte(key, value)</b></code></a>
- <a href="#querySkip"><code>query.<b>skip(n)</b></code></a>
- <a href="#queryLimit"><code>query.<b>limit(n)</b></code></a>
- <a href="#queryGet"><code>query.<b>get(n)</b></code></a>

<a name="library"></a>
### Library

<a name="ctor"></a>
### `vano(config: Config)`
#### `Config`
|            | required | default       | description
| :--------- | :------: | :------------ | :----------
| `adapter`  | ✓        |               | interface for the communication between vano and io system. it can be `file`, `memory` or a custom function. [`adapter`](README.md#adapterCustom) 

Creates a new `vano` instance.
```javascript
import vano, {memory} from 'vano';

const db = vano({adapter: memory()});
```

<a name="adapter"></a>
### Adapter

<a name="adapterFile"></a>
#### `file(base)`
Reads/writes the collections as JSON file to the provided `base` directory.
```javascript
import vano, {file} from 'vano';

const db = vano({adapter: file('./collections')});
```
***

<a name="adapterMemory"></a>
#### `memory()`
Keeps all collections in the memory.
```javascript
import vano, {memory} from 'vano';

const db = vano({adapter: memory()});
```
***

<a name="adapterCustom"></a>
#### Custom
Custom adapters can be used to read and write collections from and in different formats.
These have to adhere the `Adapter` interface and return a function with four of the following sub-functions:

| function      | parameter                  | return         | description
| :------------ | :------------------------  | :------------- | :----------
| `read`        | key: `string`              | `Promise<any> `| resource reading logic. should return anything `deserialize` is comfortable with.
| `write`       | key: `string`, data: `any` | `void`         | resource saving logic. `data` is previously by `serialize` processed.
| `serialize`   | data: `any`                | `Promise<any>` | transform data into a processable form for `write`.
| `deserialize` | data: `any`                | `Promise<any>` | transform data into a processable form for `read`.

##### Example:
```javascript
const adapterFactory = (someLibrary, someSerializer) => {
  const read = (key) => {
    return someLibrary.loadByKey(key);
  }

  const write = (key, value) => {
    someLibrary.saveByKey(key, value);
  }

  const serialize = (data) => {
    return someSerializer.serialize(data);
  }

  const deserialize = (data) => {
    return someSerializer.deserialize(data);
  }
}
```

### Collection
<a name="col"></a>
##### `db.collection(name[, schema])`
Creates a collection with:
* `name` (only alphanumeric)
* optional `schema` (rough shape of every collection item)

vano uses `schema` for autocompletion and can be omitted if not necessary.
```javascript
const col = db.collection('users', {name: "", age: 0});
```

***

<a name="colRead"></a>
#### `col.read()`
Asynchronously loads a collection into the memory via [`adapter`](README.md#adapter), given a previously written collection exists.
```javascript
col.read();
```

***

<a name="colWrite"></a>
#### `col.write()`
Asynchronously saves a collection from the memory via [`adapter`](README.md#adapter).
```javascript
col.write();
```

***

<a name="colAdd"></a>
#### `col.add(item)`
Adds an item to the collection and returns the unique `id` of the item inside the collection.
```javascript
const id = col.add({name: "john doe", "age": 30});
```

***

<a name="colAll"></a>
#### `col.all()`
Returns all items from the collection.
```javascript
const items = col.all();
```

***

<a name="colCount"></a>
#### `col.count()`
Returns the count of all items in the collection.
```javascript
const count = col.count();
```

***


<a name="colGet"></a>
#### `col.get(id)`
Returns the item from the collection via id.
```javascript
const item = col.get('ID');
```

***

<a name="colRemove"></a>
#### `col.remove(id)`
Removes the item from the collection via id.
```javascript
col.remove('ID');
```

***

<a name="colUpdate"></a>
#### `col.update(id, update)`
Updates the values of an item by an id and update object.
```javascript
col.update('ID', {name: "max mustermann"});
```

***

<a name="colReset"></a>
#### `col.reset()`
Removes all items from the collection.
```javascript
col.reset();
```

***

<a name="colQuery"></a>
#### `col.query()`
Returns a query function for basic querying. See [`query`](README.md#query).
```javascript
const query = col.query();
```

<a name="query"></a>
### Query

<a name="queryEq"></a>
#### `query.eq(key, value)`
Selects items where ``item[key]`` is **equal** value and returns a new [`query`](README.md#query) function. Value can also be a regular expression.
```javascript
const query = query.eq('name', 'doe');
```

***

<a name="queryNeq"></a>
#### `query.neq(key, value)`
Selects items where ``item[key]`` is **not equal** value and returns a new [`query`](README.md#query) function. Value can also be a regular expression.
```javascript
const query = query.neq('name', 'doe');
```

***

<a name="queryGt"></a>
#### `query.gt(key, value)`
Selects items where `item[key]` is **greater than** value and returns a new [`query`](README.md#query) function.
```javascript
const query = query.gt('age', 20);
```

***

<a name="queryGte"></a>
#### `query.gte(key, value)`
Selects items where `item[key]` is **greater than or equal** value and returns a new [`query`](README.md#query) function.
```javascript
const query = query.gte('age', 30);
```

***

<a name="queryLt"></a>
#### `query.lt(key, value)`
Selects items where `item[key]` is **lesser than** value and returns a new [`query`](README.md#query) function.
```javascript
const query = query.lt('age', 20);
```

***

<a name="queryLte"></a>
#### `query.lte(key, value)`
Selects items where `item[key]` is **lesser than or equal** value and returns a new [`query`](README.md#query) function.
```javascript
const query = query.lte('age', 30);
```

***

<a name="querySkip"></a>
#### `query.skip(n)`
Sets an offset of n and returns a new [`query`](README.md#query) function.
```javascript
const query = query.skip(2);
```

***

<a name="queryLimit"></a>
#### `query.limit(n)`
Sets a limit of n items and returns a new [`query`](README.md#query) function.
```javascript
const query = query.limit(10);
```

***

<a name="queryGet"></a>
#### `query.get()`
Returns the queried items as an array.
```javascript
const items = query.get();
```

## ToDo
* autocompletion via schema in collection.query() and collection.update()

## Licence
MIT License, see [LICENSE](./LICENSE)

[npm-src]: https://badgen.net/npm/v/vano
[npm-href]: https://www.npmjs.com/package/vano
[size-src]: https://badgen.net/packagephobia/install/vano
[size-href]: https://packagephobia.com/result?p=vano
[types-src]: https://badgen.net/npm/types/vano
[types-href]: https://www.npmjs.com/package/vano
[coverage-src]: https://coveralls.io/repos/github/sovrin/vano/badge.svg?branch=master
[coverage-href]: https://coveralls.io/github/sovrin/vano?branch=master
[vulnerabilities-src]: https://snyk.io/test/github/sovrin/vano/badge.svg
[vulnerabilities-href]: https://snyk.io/test/github/sovrin/vano
[dep-src]: https://badgen.net/david/dep/sovrin/vano
[dep-href]: https://badgen.net/david/dep/sovrin/vano
[devDep-src]: https://badgen.net/david/dev/sovrin/vano
[devDep-href]: https://badgen.net/david/dev/sovrin/vano
[license-src]: https://badgen.net/github/license/sovrin/vano
[license-href]: LICENSE