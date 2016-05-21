var jsonParser = require('../response_parsers').json

module.exports = function (apiCall) {

    return function (options, cb) {

        options = options || {}
        options.query = options.query || {}

        options.query.fmt = 3

        options.path = 'phones.php'

        options.responseParser = customParser

        return apiCall(options, cb)

    }

}

var customParser = {}

customParser.parse = function (response) {
    if (response === 'OK') {
        return {result: 'OK'}
    }

    return jsonParser.parse(response)
}
