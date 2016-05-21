describe('send api call', function () {

    var fs = require('fs')
    var FormData = require('form-data')

    var messageId

    afterEach(function () {
        return smsc.status({
            query: {
                del: 1,
                id: messageId,
                phone: phone,
            }
        })
    })

    it('sends specific message to specific receivers', function () {

        return smsc.send({
            query: {
                phones: phone,
                mes: 'hello!',
            }
        })
        .then(function (response) {
            assert(response.id)
            assert.equal(response.cnt, 1)
            messageId = response.id
        })

    })

    it('allows to set id on message', function () {

        return smsc.send({
            query: {
                phones: phone,
                mes: 'how are you?',
                id: 10,
            }
        })
        .then(function (response) {
            assert.deepEqual(response, {
                cnt: 1,
                id: 10,
            })
            messageId = response.id
        })

    })

    it('splits message in parts if it is big', function () {
        var threshold = 140,
            n = 5,
            message = 'tsup?'

        message = new Array(threshold * n / message.length + message.length)
            .join(message)

        return smsc.send({
            query: {
                phones: phone,
                mes: message,
            }
        })
        .then(function (response) {
            assert(response.id)
            assert.equal(response.cnt, 5)
            messageId = response.id
        })

    })

    it('allows to send mms messages', function () {

        var formData = new FormData()

        formData.append('redsquare',
            fs.createReadStream(__dirname + '/../fixtures/redsquare.jpg'))

        return smsc.send({
            query: {
                phones: phone,
                mms: 1,
                mes: 'that\'s me!',
            },
            request: {
                method: 'POST',
                headers: formData.getHeaders(),
            },
            requestBodyStream: formData,
        })
        .then(function (response) {
            assert(response.id)
            assert.equal(response.cnt, 1)
            messageId = response.id
        })

    })

    it('allows to send email messages', function () {

        var formData = new FormData()

        formData.append('redsquare',
            fs.createReadStream(__dirname + '/../fixtures/redsquare.jpg'))

        return smsc.send({
            query: {
                phones: 'mail@example.com',
                mail: 1,
                mes: 'that\'s me!<file 1>',
                subj: 'Me!',
                sender: email,
            },
            request: {
                method: 'POST',
                headers: formData.getHeaders(),
            },
            requestBodyStream: formData,
        })
        .then(function (response) {
            assert(response.id)
            assert.equal(response.cnt, 1)
            messageId = response.id
        })

    })

})
