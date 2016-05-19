describe('jobs api call', function () {

    var assert = require('assert')
    var fs = require('fs')
    var FormData = require('form-data')

    it.only('creates a job', function () {

        return smsc.jobs({
            query: {
                phones: phone,
                mes: 'hello!',
                name: 'Тестовая рассылка',
                add: 1,
            }
        })
        .then(function (response) {
            assert.equal(response.cnt, 1)
        })

    })

    it('allows to set id on message', function () {

        return smsc.jobs({
            query: {
                phones: phone,
                mes: 'how are you?',
                id: 10,
                name: 'Тестовая рассылка',
                add: 1,
            }
        })
        .then(function (response) {
            assert.deepEqual(response, {
                cnt: 1,
                id: 10,
            })
        })

    })

    it('splits message in parts if it is big', function () {
        var threshold = 140,
            n = 5,
            message = 'tsup?'

        message = new Array(threshold * n / message.length + message.length)
            .join(message)

        return smsc.jobs({
            query: {
                phones: phone,
                mes: message,
                name: 'Тестовая рассылка',
                add: 1,
            }
        })
        .then(function (response) {
            assert.deepEqual(response.cnt, n)
        })

    })

    it('allows to send mms messages', function () {

        var formData = new FormData()

        formData.append('redsquare',
            fs.createReadStream(__dirname + '/../fixtures/redsquare.jpg'))

        return smsc.jobs({
            query: {
                phones: phone,
                mms: 1,
                mes: 'that\'s me!',
                name: 'Тестовая рассылка',
                add: 1,
            },
            request: {
                method: 'POST',
                headers: formData.getHeaders(),
            },
            requestBodyStream: formData,
        })
        .then(function (response) {
            assert.equal(response.cnt, 1)
        })

    })

    it.skip('allows to send email messages', function () {

        var formData = new FormData()

        formData.append('redsquare',
            fs.createReadStream(__dirname + '/../fixtures/redsquare.jpg'))

        return smsc.jobs({
            query: {
                phones: 'mail@example.com',
                mail: 1,
                mes: 'that\'s me!<file 1>',
                subj: 'Me!',
                sender: 'mail@example.com',
                name: 'Тестовая рассылка',
                add: 1,
            },
            request: {
                method: 'POST',
                headers: formData.getHeaders(),
            },
            requestBodyStream: formData,
        })
        .then(function (response) {
            assert.equal(response.cnt, 1)
        })

    })

})