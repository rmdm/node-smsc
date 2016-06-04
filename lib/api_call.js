var url = require('url')
var crypto = require('crypto')
var querystring = require('querystring')
var Promise = require('promise')
var FormData = require('form-data')
var responseParsers = require('./response_parsers')

/*
 *  @param {Object} params - initialization parameters
 *  @param {Object} params.request - specifies parsed api root url
 *  @param {Object} params.transport - http or https built-in module
 *  @param {String} [params.login]
 *  @param {String} [params.password]
 *  @param {String} [params.psw] - alias to params.password
 *  @param {String} [params.hashed] - indicates that passed password already md5
 *  hashed
 */

module.exports = function (params) {

    var request = params.request
    var transport = params.transport

    var login = params.login
    var password = params.password || params.psw

    if (!params.hashed && password) {
        password = md5hash(password)
    }

    /*
     *  @param {Object} [query] - an api call query
     *  @param {Object} [options]
     *  @param {String} [options.path] - an api call path prefix
     *  @param {Array} [options.files] - an array of objects with keys
     *  "field", "value", "options", as form-data module's append method
     *  accepts. If this field is present, requestBodyStream option is ignored.
     *  @param {Stream} [options.requestBodyStream] - specifies a data source to
     *  pipe into request and use as a request body
     *  @param {Boolean} [options.stream] (false) - if specified, returns a
     *  stream asynchronously, either as a fullfilment of a promise or as a
     *  callback second parameter if one was passed
     *  @param {Object} [options.responseParser] - an object with parse method
     *  that accepts raw response string
     *  @param {Object} [options.responseParserOptions] - parse options
     *  @param {Object} [options.request] - override options per request
     *  @param {Function} [cb] - optional callback, if ommitted a promise is
     *  returned
     */

    return function (query, options, cb) {

        if (typeof query === 'function') {
            cb = query
            query = {}
            options = {}
        } else if (typeof options === 'function') {
            cb = options
            options = {}
        }

        query = query || {}
        options = options || {}

        query.login = query.login || login

        // in query password field name is always psw
        query.psw = query.psw || password

        // redefine provider's default charset
        query.charset = query.charset || 'utf-8'

        var p = new Promise(function (resolve, reject) {

            var extendedRequestOptions = extendRequestOptions(
                request,
                query,
                options
            )

            var req = transport.request(extendedRequestOptions, function (res) {
                if (options.stream) { return resolve(res) }

                var buff = new Buffer(0)

                res.on('data', function (data) {
                    buff = Buffer.concat([buff, data])
                })

                res.once('end', function () {
                    var response = buff.toString('utf8')
                    var responseParser = options.responseParser ||
                        getResponseParser(query)

                    resolve(responseParser.parse(response, options.responseParserOptions))
                })

                res.once('error', reject)

            })

            req.once('error', reject)

            if (Array.isArray(options.files)) {

                var formData = new FormData()

                options.files.forEach(function (file) {
                    formData.append(file.field, file.value, file.options)
                })

                var headers =formData.getHeaders()

                for (var headerName in headers) {
                    req.setHeader(headerName, headers[headerName])
                }

                formData.pipe(req)

            } else if (options.requestBodyStream) {
                options.requestBodyStream.pipe(req)
            } else {
                req.end()
            }

        })

        if (!cb) { return p }

        p.then(function (result) {
            cb(null, result)
        }, function (err) {
            cb(err)
        })
    }

}

function extendRequestOptions (request, query, options) {

    options.path = options.path || ''

    var basicOptions = url.parse(url.resolve(request, options.path))

    basicOptions.path += '?' + querystring.stringify(query)

    for (var optionName in request) {
        if (!basicOptions.hasOwnProperty(optionName)) {
            basicOptions[optionName] = request[optionName]
        }
    }

    for (var optionOverride in options.request) {
        basicOptions[optionOverride] = options.request[optionOverride]
    }

    if (options.files || options.requestBodyStream) {
        basicOptions.method = 'POST'
    }

    return basicOptions

}

function getResponseParser (query) {

    switch(query.fmt) {
        case 3:
            return responseParsers.json
        default:
            return responseParsers.raw
    }

}

function md5hash (str) {
    return crypto
        .createHash('md5')
        .update(str)
        .digest('hex')
        .toLowerCase()
}
