/*
 *  All of the test cases here are disabled because smsc's API does not provide
 *  a call to drop a user and has strict restirctions on frequency of calls.
 *  Plus, at the moment of writing, there was problems with "pay" API call.
 */

describe('users api call', function () {

    var variation = 0

    context('user creation', function () {

        it.skip('allows to create a subclient', function () {

            variation++

            return smsc.users({
                add: 1,
                user: sublogin + variation,
                password: subpassword + variation,
            })
            .then(function (response) {
                assert(response.id)
                userId = response.id
            })
        })

    })

    context('user manipulation', function () {

        var userId

        beforeEach(function () {

            variation++

            return smsc.users({
                add: 1,
                user: sublogin + variation,
                password: subpassword + variation,
            })
            .then(function (response) {
                userId = response.id
            })
        })

        it.skip('allows to change a sublient\'s settings', function () {
            return smsc.users({
                chg: 1,
                user: sublogin + variation,
                fio: 'User From Test',
            })
            .then(function (response) {
                assert.equal(response.result, 'OK')
            })
        })

        it.skip('allows to change a subclient\'s balance', function () {
            return smsc.users({
                pay: 1,
                user: sublogin + variation,
                sum: '0.01',
            })
            .then(function (response) {
                console.log(response)
            })
        })

        it.skip('allows to get a subclient\'s stats', function () {
            return smsc.users({
                get_stat: 1,
                user: sublogin + variation,
            })
            .then(function (response) {
                assert.deepEqual(response, [])
            })
        })

    })


})
