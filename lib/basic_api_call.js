var url = require('url')
var http = require('http')
var https = require('https')
var Promise = require('bluebird')

var defaultUrlRoot = 'https://smsc.ru/sys/'

/*
 *  @param {Object|String} urlRoot (https://smsc.ru/sys/) - specifies api root 
 *  path
 */

module.exports = function (params) {

    params = params || {}

    params.urlRoot = params.urlRoot || defaultUrlRoot

    var transport = getTransport(params.urlRoot)

    /*
     *  @param {Object} query - api call query
     *  @param {String} [path] ('') - optional api call path prefix, empty
     *  string by default
     *  @param {Boolean} [stream] (false) - if specified, returns stream 
     *  asynchronously, either as fullfilment of promise or as callback 
     *  second parameter if one was passed
     *  @param {Function} [cb] - optional callback, if ommitted promise is
     *  returned
     */

    return function (options) {
        var p = new Promise(function (resolve, reject) {

            var queryOptions = getQueryOptions(params.urlRoot, options.path, options.query)

            transport.request(queryOptions, function (res) {
                if (options.stream) { return resolve(res) }

                res.pipe(responseCollector)
                
            })

        })

        if (!cb) { return p }

        p.then(function (result) {
            cb(null, result)
        }, function (err) {
            cb(err)
        })
    }

}

function getTransport (url) {

}

function getQueryOptions (url, path, query) {

}

