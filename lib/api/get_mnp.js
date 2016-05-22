module.exports = function (apiCall) {

    return function (options, cb) {

        options = options || {}
        options.query = options.query || {}

        options.query.fmt = 3

        options.path = 'get_mnp.php'

        if (!options.query.date) {
            options.stream = true
        }

        return apiCall(options, cb)

    }

}
