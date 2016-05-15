module.exports = function (apiCall) {

	return function (options, cb) {

		return apiCall({
			path: 'send.php',
			query: options.query,
			request: options.request,
		}, cb)

	}

}
