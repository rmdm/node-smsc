var Promise = require('promise')
var SmscApiError = require('../api_error')

function isError (response) {
    return !!response.error_code
}

module.exports = {

    parse: function (response) {
        return Promise.resolve()
        .then(function () {

            if (response === 'OK') {
                return {result: 'OK'}
            }

            if (response === '') {
                return {result: ''}
            }

            var parsed = JSON.parse(response)

            if (isError(parsed)) {
                throw new SmscApiError(parsed)
            }
            return parsed
        })
    },

}
