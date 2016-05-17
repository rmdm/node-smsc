describe('send api call', function () {

    var assert = require('assert')

    describe('basic dispatch', function () {

        it('sends specific message to specific receivers', function () {

            return smsc.send({
                query: {
                    phones: '11111111111',
                    mes: 'hello!',
                }
            })
            .then(function (response) {
                assert.equal(response.cnt, 1)
            })

        })

    })

})