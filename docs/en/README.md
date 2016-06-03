Example
=======

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

API
===

###initSmsc

`function initSmsc (options)` - function returned by module.

####options

* `login` - user login
* `psw` - user password
* `password` - alias for `psw`
* `hashed` - flag telling wether password is hashed or not
* `request` - API url, or same options as `request` method of `http` or `https`
module accepts. `https://smsc.ru/sys/` by default.
* `apiCalls` - object allowng to define user api calls or redefine build-in
ones. Keys - methods names, values - functions with the same structure as
built-in ones.

Returns object with the followng keys - names of API routes:

- `send`
- `jobs`
- `status`
- `balance`
- `phones`
- `users`
- `info`
- `get`
- `get_mnp`
- `receive_phones`
- `senders`

Values, with some inner differences, has the following common interface:

`function apiCall (query, options, cb)`

- `query` - parameters described and acceptable by API
- `options`
  - `options.files` - an array of object with the fields `field`, `value`,
    `options`. Field Values used to parametrize `append` method of `form-data`
    module, used internally. If the field is present, another one,
    `requestBodyStream` is ignored.
  - `options.requestBodyStream` - set `Readable` request body stream
  - `options.stream` - flag, indicating to return raw response stream
  - `options.responseParser` - an object with `parse` method, accepting
    response casted to 'utf8' string and parser options
  - `options.responseParserOptions` - parser options
  - `options.request` - redefine requerst options (same options as `request`
  method of `http` or `https` module accepts)
- `cb` - optional callback, if not specified a Promise is returned

###SmscApiError

`SmscApiError (message, response)` - Subcalss of `Error`. Class instances
may be passed as first argument of callback or api call rejection handler.

Differences from provider
=========================

* Encoding by default - `utf-8`
* In cases when provider returns `OK`, module's calls return `{result: 'OK'}`.

Tests
=====

__Before running tests, you shoud turn test mode on in your service profile.
Otherwise, test run will lead to sending of real sms.__

Tests require some setup. You should create `test/config.json` file with
the following structure:


```json
{
    "init": {
        "login": "<LOGIN>",
        "password": "<PASSWORD>",
        "hashed": true
    },
    "phone": "79XXXXXXXXX",
    "email": "a@b.c",
    "sublogin": "sublogin",
    "subpassword": "subpassword"
}
```

#####Fields description:

- `init` - the same options as `initSmsc` function accepts
- `phone` - a phone number, controlled by you. In case you forgot to turn test
mode on, sms will go to this number.
- `email` - an email address, controlled by you. To send email you need to
set you email addres in you profile. Test mode does not span on email messages,
by this reason corresponding tests are disabled by default.
- `sublogin` - test subclient login. All tests on subclients are disabled by
default, because there is no teardown support from API.
- `subpassword` - subclient password

