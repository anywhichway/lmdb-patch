# lmdb-patch
Provides a patch method for LMDB to do partial object updates.

# Installation

```
npm install lmdb-patch
```

# Usage

`lmdb-patch` exports a single function `patch` that needs to be bound to an open database, e.g.

```javascript
import {open} from "lmdb";
import {patch} from "lmdb-patch";

const db = open("test", {create: true});
db.patch = patch;
```

# API

## async patch(key,value,version,ifVersion)

From a call interface perspective, `patch` works the same way as the [LMDB put function](https://github.com/kriszyp/lmdb-js#dbputkey-value-version-number-ifversion-number-promiseboolean).

If `value` is a primitive and there is no existing value, the function returns `false`. Otherwise, the old value is potentially replaced using the same version semantics as `put` with these additional constraints:

  * If `value` is a function, it will be called with the existing value as an argument and the return value will be used as the patched value. You could use this for a counter.
  * If the existing value is not the same type as `value` or if the `value` is a primitive, the existing value will be replaced.
  * If the `value` is an object, it will be merged with the existing value via `Object.assign`. Then, the passed in `value` will be walked for any properties and child properties that are explicitly `undefined` and these properties will be deleted from the merged value.

For example:

```javascript
// assume person1 = {name:"Joe",housing:{homeowner:true}}
await db.patch("person1",{housing:{homeowner:undefined,renter:true}})
// now person1 = {name:"Joe",housing:{renter:true}}
```

# Testing

Testing is conducted using Jest.

File      | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
----------|---------|----------|---------|---------|-------------------
All files |     100 |      100 |     100 |     100 |                   
index.js |     100 |      100 |     100 |     100 |


# Release Notes (Reverse Chronological Order)

2023-04-19 v1.0.1 Documentation updates.

2023-04-14 v1.0.0 Updated documentation. 100% test coverage.

2023-04-14 v0.0.1 Initial release.
