const FlexibleCache = require('./lib');

const { log } = console;

const cache = new FlexibleCache({
  primaryKey: 'id',
  secondaryKeys: ['name'],

  max: 2
});

cache.set({
  id: 'abc',
  name: 'john'
});

cache.set({
  id: 'def',
  name: 'jane'
});

// expected: { id: 'abc', name: 'john' }
log(
  'Retrieving a value with its primary key',
  cache.get('abc')
);

// expected: { id: 'def', name: 'jane' }
log(
  'Retrieving a value with one of its secondary keys',
  cache.get('jane', 'name')
);

// expected: undefined
log(
  'Retrieving a value with one of its secondary keys, but without specifying the secondary key.',
  cache.get('jane')
);

cache.set({
  id: 'hij',
  name: 'johnny'
});

cache.set({
  id: 'klm',
  name: 'johnny'
});

cache.set({
  id: 'nop',
  name: 'johnny'
});

// expected: undefined
log(
  'Retrieving an evicted value',
  cache.get('abc')
);

// expected: undefined
log(
  'Retrieving a fake value',
  cache.get('fake')
);

// expected: { id: 'nop', name: 'johnny' }
log(
  'Retrieving a new value',
  cache.get('nop')
);

cache.delete('klm');
cache.delete('johnny', 'name');

log(
  '\n\nCache\n',
  cache
);