module.exports = SmscApiError

var inherits = require('util').inherits

inherits(SmscApiError, Error)

function SmscApiError (message, response) {

    if (typeof message !== 'string') { 
        if (message && typeof message === 'object') {
            response = message
            message = ''
        }
    }

    Error.call(this, message)
    Error.captureStackTrace(this, SmscApiError)

    this.name = 'SmscApiError'
    this.message = message
    this.response = response
}
