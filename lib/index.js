module.exports = createSmscApi

var http = require('http')
var https = require('https')
var url = require('url')

var initBasicApiCall = require('./basic_api_call')
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

    var basicApiCall = initBasicApiCall({
        url: url,
        transport: transport,
    })

    return initApi(basicApiCall)

}

function getTransport (requestOptions) {
    requestOptions = url.parse(requestOptions)

    if (requestOptions.protocol === 'http') {
        return http
    }

    return https
}

function initApi (basicApiCall) {

    var api = {}

    for (var apiCallName in apiCalls) {
        api[apiCallName] = apiCalls[apiCallName](basicApiCall)
    }

    return api

}
