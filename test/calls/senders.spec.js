describe('senders api call', function () {

    it('gets list of registered senders ID', function () {

        return smsc.senders({
            get: 1,
        })
        .then(function (response) {
            assert(Array.isArray(response))
        })

    })

})
