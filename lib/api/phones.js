module.exports = function (apiCall) {

    return function (options, cb) {

        options = options || {}
        options.query = options.query || {}

        options.query.fmt = 3

        options.path = 'phones.php'

        return apiCall(options, cb)

    }

}
