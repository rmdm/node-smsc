describe('info api call', function () {

    it('allows to get operator info about a phone number', function () {

        return smsc.info({
            get_operator: 1,
            phone: phone,
        })
        .then(function (response) {
            assert(response.country)
            assert(response.operator)
            assert(response.region)
            assert(response.mcc)
            assert(response.mnc)
            assert(response.tz)
        })

    })

})
