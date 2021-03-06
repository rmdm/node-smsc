module.exports = function (apiCall) {

    return function (query, options, cb) {

        options = options || {}
        query = query || {}

        query.fmt = 3

        options.path = 'get.php'

        return apiCall(query, options, cb)
        .then(null, function (err) {

            if (
                err.response &&
                err.response.error_code == 3 && (
                    query.get_messages == 1 ||
                    query.get_mega_accounts == 1
                )
            ) { return [] }

            throw err
        })

    }

}
