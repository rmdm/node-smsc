module.exports = ApiError

function ApiError (message, response) {

    if (typeof message !== 'string') { 
        if (message && typeof message === 'object') {
            response = message
            message = ''
        }
    }

    Error.call(this, message)
    Error.captureStackTrace(this, ApiError)

    this.response = response
}
