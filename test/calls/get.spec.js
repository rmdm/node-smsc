describe('get api call', function () {

    it('allows to get history of messages', function () {

        return smsc.get({
            get_messages: 1,
            phone: phone,
        })
        .then(function (response) {
            assert(Array.isArray(response))
        })

    })

    it('allows to get list of incoming messages', function () {

        return smsc.get({
            get_answers: 1,
        })
        .then(function (response) {
            assert(Array.isArray(response))
        })

    })

    it('allows to get statistics of outgoing messages', function () {

        return smsc.get({
            get_stat: 1,
        })
        .then(function (response) {
            assert(Array.isArray(response))
        })

    })

    it('allows to get megaphone account statistics', function () {

        return smsc.get({
            get_mega_accounts: 1,
        })
        .then(function (response) {
            assert(Array.isArray(response))
        })

    })

    it('allows to get list of current client tariffs', function () {

        return smsc.get({
            get_price: 1,
        })
        .then(function (response) {
            assert(Array.isArray(response.zones))
        })

    })

})
