module.exports = function (apiCall) {

	return function (options, cb) {

		return apiCall({
			path: 'jobs.php',
			query: options.query,
			request: options.request,
		}, cb)

	}

}
