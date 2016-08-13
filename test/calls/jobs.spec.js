describe('jobs api call', function () {

    var fs = require('fs')
    var FormData = require('form-data')

    var jobId

    afterEach(function () {
        return smsc.jobs({
            del: 1,
            id: jobId,
        })
    })

    it('creates a job', function () {

        return smsc.jobs({
            phones: phone,
            mes: 'hello!',
            name: 'Тестовая рассылка',
            add: 1,
        })
        .then(function (response) {
            assert(response.id)
            jobId = response.id
        })

    })

    it('allows to cancel a job', function () {
        return smsc.jobs({
            phones: phone,
            mes: 'hi!',
            name: 'Тестовая рассылка',
            add: 1,
        })
        .then(function (response) {
            assert(response.id)
            jobId = response.id
        })
        .then(function () {
            return smsc.jobs({
                cancel: 1,
                id: jobId,
            })
        })
        .then(function (response) {
            assert.equal(response.result, 'OK')
        })
    })

    it('allows to set id on message', function () {

        return smsc.jobs({
            phones: phone,
            mes: 'how are you?',
            id: 10,
            name: 'Тестовая рассылка',
            add: 1,
        })
        .then(function (response) {
            assert(response.id)
            jobId = response.id
        })

    })

    it('splits message in parts if it is big', function () {
        var threshold = 140,
            n = 5,
            message = 'tsup?'

        message = new Array(threshold * n / message.length + message.length)
            .join(message)

        return smsc.jobs({
            phones: phone,
            mes: message,
            name: 'Тестовая рассылка',
            add: 1,
        })
        .then(function (response) {
            assert(response.id)
            jobId = response.id
        })

    })

    it('allows to send mms messages', function () {

        // see send.spec.js for another example of sending files

        var formData = new FormData()

        formData.append('redsquare',
            fs.createReadStream(__dirname + '/../fixtures/redsquare.jpg'))

        return smsc.jobs({
            phones: phone,
            mms: 1,
            mes: 'that\'s me!',
            name: 'Тестовая рассылка',
            add: 1,
        },
        {
            request: {
                method: 'POST',
                headers: formData.getHeaders(),
            },
            requestBodyStream: formData,
        })
        .then(function (response) {
            assert(response.id)
            jobId = response.id
        })

    })

    // smsc's test mode doesn't span on email messages (i.e. they are paid either way)

    it.skip('allows to send email messages', function () {

        var formData = new FormData()

        formData.append('redsquare',
            fs.createReadStream(__dirname + '/../fixtures/redsquare.jpg'))

        return smsc.jobs({
            phones: 'mail@example.com',
            mail: 1,
            mes: 'that\'s me!<file 1>',
            subj: 'Me!',
            sender: email,
            name: 'Тестовая рассылка',
            add: 1,
        },
        {
            request: {
                method: 'POST',
                headers: formData.getHeaders(),
            },
            requestBodyStream: formData,
        })
        .then(function (response) {
            assert(response.id)
            jobId = response.id
        })

    })

    it('allows to use a template instead of a message', function () {
        return smsc.templates({
            add: 1,
            name: 'job-template',
            msg: 'Text of the job template.',
            format: 'sms',
        })
        .then(function (template) {
            return smsc.jobs({
                phones: phone,
                tpl: template.id,
                name: 'Шаблонная рассылка',
                add: 1,
            })
        })
        .then(function (response) {
            assert(response.id)
            jobId = response.id
        })
    })

})
