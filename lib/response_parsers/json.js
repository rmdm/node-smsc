var Promise = require('promise')
var ApiError = require('../api_error')

function isError (response) {
    return !!response.error_code
}

module.exports = {

    parse: function (response) {
    	return Promise.resolve()
    	.then(function () {
	        var parsed = JSON.parse(response)

	        if (isError(parsed)) {
	            throw new ApiError(parsed)
	        }
	        return parsed
    	})
    },

}
