describe('status api call', function () {

    var messageId

    before(function () {
        return smsc.send({
            query: {
                phones: phone,
                mes: 'ПРОВЕРКА',
            }
        })
        .then(function (response) {
            messageId = response.id
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
