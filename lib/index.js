var http = require('http')
var https = require('https')
var url = require('url')

var initApiCall = require('./api_call')
var apiCalls = require('./api')

var defaultUrlRoot = 'https://smsc.ru/sys/'

/*
 *  @param {Object} [options]
 *  @param {String} [options.login] - preset login on all api calls. If not
 *  provided you will must to pass login per api call basis.
 *  @param {String} [options.psw] - preset password on all api calls. If not
 *  provided you will must to pass password per api call basis.
 *  @param {String} [options.password] - alias to psw
 *  @param {Boolean} [options.hashed] - indicates that passed password already md5
 *  hashed
 *  @param {String|Object} [options.request] - options to http/https request
 *  method
 *  @param {Object} [apiCalls] - user defined api calls, can be useful sometimes
 */

function initSmsc (options) {

    options = options || {}

    var request = url.parse(options.request || defaultUrlRoot)

    var transport = getTransport(request)

    var apiCall = initApiCall({
        request: request,
        transport: transport,
        login: options.login,
        password: options.password,
        psw: options.psw,
        hashed: options.hashed,
    })

    return initApi(apiCall, options.apiCalls)

}

function getTransport (request) {
    request = url.parse(request)

    if (request.protocol === 'http:') {
        return http
    }

    return https
}

function initApi (apiCall, userDefinedApiCalls) {

    var callNames = Object.keys(apiCalls)

    if (userDefinedApiCalls && typeof userDefinedApiCalls !== 'undefined') {
        callNames = callNames.concat(Object.keys(userDefinedApiCalls))
    }

    var api = {}

    for (var i = 0; i < callNames.length; i++) {
        var apiCallName = callNames[i]
        api[apiCallName] = (apiCalls[apiCallName] || userDefinedApiCalls[apiCallName])(apiCall)
    }

    return api

}

exports = module.exports = initSmsc

exports.initApiCall = initApiCall

exports.SmscApiError = require('./api_error')
