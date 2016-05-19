var http = require('http')
var https = require('https')
var url = require('url')

var initApiCall = require('./api_call')
var apiCalls = require('./api')

var defaultUrlRoot = 'https://smsc.ru/sys/'

/*
 *  @param {String} [login] - preset login on all api calls. If not
 *  provided you will must to pass login per api call basis.
 *  @param {String} [password] - preset password on all api calls. If not
 *  provided you will must to pass password per api call basis.
 *  @param {String} [psw] - alias to password
 *  @param {Boolean} [hashed] - indicates that passed password already md5
 *  hashed
 *  @param {String|Object} [request] - options to http/https request
 *  method
 */

function createSmscApi (options) {

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

    return initApi(apiCall)

}

function getTransport (request) {
    request = url.parse(request)

    if (request.protocol === 'http:') {
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

exports.SmscApiError = require('./api_error')
