before(function () {
    var config = require('./config')

    global.assert = require('assert')
    global.smsc = require('../')(config.init)
    global.phone = config.phone
    global.email = config.email

    global.sublogin = config.sublogin
    global.subpassword = config.subpassword
})
