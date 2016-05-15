exports = module.exports = createSmscApi

var http = require('http')
var https = require('https')
var url = require('url')

var initApiCall = require('./api_call')
var apiCalls = require('./api')

var defaultUrlRoot = 'https://smsc.ru/sys/'

/*
 *  @param {String} login
 *  @param {String} password
 *  @param {String|Object} [requestOptions] - options to http/https request 
 *  method
 */

function createSmscApi (options) {

    var url = options.requestOptions || defaultUrlRoot

    var transport = getTransport(url)

    var apiCall = initApiCall({
        url: url,
        transport: transport,
    })

    return initApi(apiCall)

}

function getTransport (requestOptions) {
    requestOptions = url.parse(requestOptions)

    if (requestOptions.protocol === 'http') {
        return http
    }

    return https
}

function initApi (apiCall) {

    var api = {}

    for (var apiCallName in apiCalls) {
        api[apiCallName] = apiCalls[apiCallName](apiCall)
    }

    return api

}

exports.initApiCall = initApiCall
