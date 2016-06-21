node-smsc
=========

Convenient wrapper of http/https smsc api.

Example
-------

```javascript
var smsc = require('node-smsc')({
    login: 'login',
    password: '5f4dcc3b5aa765d61d8327deb882cf99',
    hashed: true,
})

smsc.send({
    phones: '79XXXXXXXXX',
    mes: 'Hello from node-smsc!',
})
```

For more examples see tests.

Documentation
-------------

- [RU](./docs/ru/README.md)
- [EN](./docs/en/README.md)
