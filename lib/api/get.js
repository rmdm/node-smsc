module.exports = function (apiCall) {

    return function (options, cb) {

        options = options || {}
        options.query = options.query || {}

        options.query.fmt = 3

        options.path = 'get.php'

        return apiCall(options, cb)
        .then(null, function (err) {

            if (
                err.response.error_code == 3 && (
                    options.query.get_messages == 1 ||
                    options.query.get_mega_accounts == 1
                )
            ) { return [] }

            throw err
        })

    }

}
