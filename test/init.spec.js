before(function () {
    var config = require('./config')

    GLOBAL.assert = require('assert')
    GLOBAL.smsc = require('../')(config.init)
    GLOBAL.phone = config.phone
    GLOBAL.email = config.email

    GLOBAL.sublogin = config.sublogin
    GLOBAL.subpassword = config.subpassword
})
