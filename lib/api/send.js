module.exports = function (apiCall) {

    return function (query, options, cb) {

        options = options || {}
        query = query || {}

        query.fmt = 3

        options.path = 'send.php'

        return apiCall(query, options, cb)

    }

}
