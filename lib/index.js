var http = require('http')
var https = require('https')
var url = require('url')
var crypto = require('crypto')

var initApiCall = require('./api_call')
var apiCalls = require('./api')

var defaultUrlRoot = 'https://smsc.ru/sys/'

/*
 *  @param {String} [login] - preset login on all api calls. If not
 *  provided you will must to pass login per api call basis.
 *  @param {String} [password] - preset password on all api calls. If not
 *  provided you will must to pass password per api call basis.
 *  @param {String} [psw] - alias to password
 *  @param {Boolean} [hashed] - indicates that passed password already md5 hashed
 *  @param {String|Object} [requestOptions] - options to http/https request 
 *  method
 */

function createSmscApi (options) {

    options = options || {}

    var requestOptions = url.parse(options.requestOptions || defaultUrlRoot)

    var transport = getTransport(requestOptions)

    var password = options.password || options.psw

    if (!options.hashed) {
        password = md5hash(password)
    }

    var apiCall = initApiCall({
        requestOptions: requestOptions,
        transport: transport,
        login: options.login,
        password: password,
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

function md5hash (str) {
    return crypto
        .createHash('md5')
        .update(str)
        .digest('hex')
        .toLowerCase()
}

exports = module.exports = createSmscApi

exports.initApiCall = initApiCall

exports.SmscApiError = require('./api_error')
