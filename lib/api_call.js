var url = require('url')
var crypto = require('crypto')
var querystring = require('querystring')
var Promise = require('promise')
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

    if (!params.hashed) {
        password = md5hash(password)
    }

    /*
     *  @param {Object} options
     *  @param {Object} options.query - an api call query
     *  @param {String} options.path - an api call path prefix
     *  @param {Boolean} [options.stream] (false) - if specified, returns a
     *  stream asynchronously, either as a fullfilment of a promise or as a
     *  callback second parameter if one was passed
     *  @param {Stream} [options.requestBodyStream] - specifies a data source to
     *  a pipe into request and use as a request body
     *  @param {Object} [options.responseParser] - an object with parse method
     *  that accepts raw response string
     *  @param {Object} [options.responseParserOptions] - parse options
     *  @param {Function} [cb] - optional callback, if ommitted a promise is
     *  returned
     *  @param {Object} request - override options per request
     */

    return function (options, cb) {

        options.query = options.query || {}
        options.query.login = options.query.login || login

        // in query password field name is always psw
        options.query.psw = options.query.psw || password

        // redefine provider's default charset
        options.query.charset = options.query.charset || 'utf-8'

        var p = new Promise(function (resolve, reject) {

            var extendedRequestOptions = extendRequestOptions(
                request,
                options.request,
                options.path,
                options.query
            )

            var req = transport.request(extendedRequestOptions, function (res) {
                if (options.stream) { return resolve(res) }

                var buff = new Buffer(0)

                res.once('data', function (data) {
                    buff = Buffer.concat([buff, data])
                })

                res.once('end', function () {
                    var response = buff.toString('utf8')
                    var responseParser = options.responseParser ||
                        getResponseParser(options.query)

                    resolve(responseParser.parse(response, options.responseParserOptions))
                })

                res.once('error', reject)

            })

            req.once('error', reject)

            if (options.requestBodyStream) {
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

function extendRequestOptions (request, requestOverrides, path, query) {
    var basicOptions = url.parse(url.resolve(request, path))

    basicOptions.path += '?' + querystring.stringify(query)

    for (var optionName in request) {
        if (!basicOptions.hasOwnProperty(optionName)) {
            basicOptions[optionName] = request[optionName]
        }
    }

    for (var optionOverride in requestOverrides) {
        basicOptions[optionOverride] = requestOverrides[optionOverride]
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
