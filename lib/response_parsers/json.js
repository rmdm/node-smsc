var Promise = require('promise')
var ApiError = require('../api_error')

function isError (response) {
    return !!response.error_code
}

module.exports = {

    parse: function (response) {
        var parsed = JSON.parse(response)
        if (isError(parsed)) {
            return Promise.reject(new ApiError(parsed))
        }
        return Promise.resolve(parsed)
    },

}
