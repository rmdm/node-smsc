before(function () {
    try {
        var config = require('./config')
    } catch (e) {
        throw e
    }

    GLOBAL.smsc = require('../')(config.init)
    GLOBAL.phone = config.phone
})
