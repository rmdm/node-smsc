describe('receive_phones api call', function () {

    it('shows list of available dedicated numbers', function () {

        return smsc.receive_phones({
            get: 1,
        })
        .then(function (response) {
            assert(Array.isArray(response))
        })

    })

})
