var url = require('url')
var querystring = require('querystring')
var Promise = require('promise')
var responseParsers = require('./response_parsers')

/*
 *  @param {Object} params - initialization parameters  
 *  @param {Object} params.requestOptions - specifies parsed api root url
 *  @param {Object} params.transport - http or https built-in module
 */

module.exports = function (params) {

    var requestOptions = params.requestOptions
    var transport = params.transport

    /*
     *  @param {Object} options
     *  @param {Object} options.query - an api call query
     *  @param {String} options.path - an api call path prefix
     *  @param {Boolean} [options.stream] (false) - if specified, returns a  
     *  stream asynchronously, either as a fullfilment of a promise or as a 
     *  callback second parameter if one was passed
     *  @param {Stream} [options.requestBodyStream] - specifies a data source to 
     *  a pipe into request and use as a request body
     *  @param {Object} [options.responseParser]
     *  @param {Function} [cb] - optional callback, if ommitted a promise is
     *  returned
     */

    return function (options, cb) {

        var p = new Promise(function (resolve, reject) {

            var extendedRequestOptions = extendRequestOptions(
                requestOptions,
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

                    resolve(responseParser.parse(response))
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

function extendRequestOptions (requestOptions, path, query) {
    var basicOptions = url.parse(url.resolve(requestOptions, path))

    basicOptions.search = querystring.stringify(query)

    for (var optionName in requestOptions) {
        if (!basicOptions.hasOwnProperty(optionName)) {
            basicOptions[optionName] = requestOptions[optionName]
        }
    }

    return basicOptions

}

function getResponseParser (query) {

    switch(query.fmt) {
        case 0: 
            return responseParsers.kv
        case 1:
            return responseParsers.csv
        case 2:
            return responseParsers.xml
        case 3:
            return responseParsers.json
        default: 
            return responseParsers.identity
    }

}
