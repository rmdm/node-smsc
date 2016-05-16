var http = require('http')
var https = require('https')
var url = require('url')

var apiCalls = require('./api')
var initApiCall = apiCalls.api_call

var defaultUrlRoot = 'https://smsc.ru/sys/'

/*
 *  @param {String|Object} [requestOptions] - options to http/https request 
 *  method
 */

function createSmscApi (options) {

    options = options || {}

    var requestOptions = url.parse(options.requestOptions || defaultUrlRoot)

    var transport = getTransport(requestOptions)

    var apiCall = initApiCall({
        requestOptions: requestOptions,
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

exports = module.exports = createSmscApi

exports.initApiCall = initApiCall

exports.ApiError = require('./api_error')
