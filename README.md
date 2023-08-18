# Flexible Cache

A flexible LRU cache made with the excellent [lru-cache](https://github.com/isaacs/node-lru-cache) package.


This package presents an alternative caching methodology that simplifies the caching process. It facilitates the storage of values using primary and secondary keys, eliminating the need for explicit key specification.
The objective is to is to simplify the complexities of key management, enabling a focus on constructing applications.

### Key Features:

- **Effortless Storage**:  You no longer need to manage and pass keys when storing values. The library handles the caching process based on predefined rules.

- **Primary and Secondary Keys**: Store values based on primary keys for efficient retrieval. Additionally, you can use secondary keys, in order to have a flexible caching strategy.

- **Automatic Management**: The use of ``The library efficiently manages cache eviction based on usage patterns, ensuring that valuable memory resources are optimized.

### Usage:

```javascript
const FlexibleCache = require('flexible-cache');

const cache = new FlexibleCache({

  // you choose a primary key for the cache
  primaryKey: 'id',

  // you can add as many secondary keys as you want
  secondaryKeys: ['name'],

  // you need to set a maximum size for the cache (you can have more options for the cache here: https://github.com/isaacs/node-lru-cache)
  max: 500,

  updateAgeOnGet: true,
});

// adding a value in the cache is as simple as that :)
cache.set({
  id: '123',
  name: 'john'
});

// { id: '123', name: 'john' }
cache.get('123');
// or
cache.get('john', 'name');

// delete the entry in the cache
cache.delete('123');
```

### Options
**primaryKey**: the primary key for the cache
**secondaryKeys**: the secondary keys
**...**: All the remaining options are for the `lru-cache`, and are listed [here](https://github.com/isaacs/node-lru-cache).

> **Note**
> The `dispose` option of the LRU cache can't be used for now

### API

**.set(value)**
Add a value to the cache

**.get(key, secondaryKey?)**
Retrieves a value. By default, the provided key is the primaryKey, but you can choose another key by providing a secondaryKey listed in the options.

**.delete(key, secondaryKey?)**
Removes a value from the cache.