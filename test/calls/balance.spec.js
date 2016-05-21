describe('balance api call', function () {

    it('allows to check balance of a client', function () {
        return smsc.balance()
        .then(function (response) {
            assert(response.balance)
        })
    })

})
