node-smsc
=========

Convenient wrapper of http/https [smsc](https://smsc.ru/) api.

Example
-------

```javascript
var smsc = require('node-smsc')({
    login: 'login',
    password: 'password', // password is md5-hashed implicitly unless "hashed" option is passed.
})

smsc.send({
    phones: '79XXXXXXXXX',
    mes: 'Hello from node-smsc!',
})  // returns a Promise with send results
```

For more examples see tests.

Documentation
-------------

- [RU](./docs/ru/README.md)
- [EN](./docs/en/README.md)
