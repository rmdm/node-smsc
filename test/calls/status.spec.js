describe('status api call', function () {

    var messageId
    var count = 0

    beforeEach(function () {
        return smsc.send({
            query: {
                phones: phone,
                mes: 'ПРОВЕРКА ' + count++,
            }
        })
        .then(function (response) {
            messageId = response.id
        })
    })

    context('message check', function () {

        afterEach(function () {
            return smsc.status({
                query: {
                    del: 1,
                    id: messageId,
                    phone: phone,
                }
            })
        })

        it('allows to check a message status', function () {

            return smsc.status({
                query: {
                    id: messageId,
                    phone: phone,
                }
            })
            .then(function (response) {
                assert.notEqual(response.status, undefined)
            })

        })

    })

    context('message drop', function () {

        it('allows to delete a message from messages history', function () {

            return smsc.status({
                query: {
                    del: 1,
                    id: messageId,
                    phone: phone,
                }
            })
            .then(function (response) {
                assert.equal(response.result, 'OK')
            })

        })

    })

})
