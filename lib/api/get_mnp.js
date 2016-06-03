module.exports = function (apiCall) {

    return function (query, options, cb) {

        options = options || {}
        query = query || {}

        query.fmt = 3

        options.path = 'get_mnp.php'

        if (!query.date) {
            options.stream = true
        }

        return apiCall(query, options, cb)

    }

}
