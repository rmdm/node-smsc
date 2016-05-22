describe.skip('users api call', function () {

    context('user creation', function () {

        // var userId

        // afterEach(function () {
        //     return smsc.users({
        //         query: {
        //             del: 1,
        //             id: userId,
        //         }
        //     })
        // })

        it('allows to create subclient', function () {
            return smsc.users({
                query: {
                    add: 1,
                    user: sublogin,
                    password: subpassword,
                }
            })
            .then(function (response) {
                assert(response.id)
                userId = response.id
            })
        })

    })

    context('user manipulation', function () {

        // var userId

        // beforeEach(function () {
        //     return smsc.users({
        //         query: {
        //             add: 1,
        //             user: sublogin,
        //             password: subpassword,
        //         }
        //     })
        //     .then(function (response) {
        //         userId = response.id
        //     })
        // })

        // afterEach(function () {
        //     return smsc.users({
        //         query: {
        //             del: 1,
        //             id: userId,
        //         }
        //     })
        // })

        it('allows to change sublient settings', function () {
            return smsc.users({
                query: {
                    chg: 1,
                    user: sublogin,
                    fio: 'User From Test',
                }
            })
            .then(function (response) {
                assert.equal(response.result, 'OK')
            })
        })

        // it('allows to change subclient balance', function () {
        //     return smsc.users({
        //         query: {
        //             pay: 1,
        //             user: sublogin,
        //             sum: '0.01',
        //         }
        //     })
        //     .then(function (response) {
        //         console.log(response)
        //     })
        // })

        it('allows to get subclient stats', function () {
            return smsc.users({
                query: {
                    get_stat: 1,
                    user: sublogin,
                }
            })
            .then(function (response) {
                console.log(response)
            })
        })

    })


})
