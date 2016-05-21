describe('phones api call', function () {

    context('contact-related functionality', function () {

        var contactPhone = '11111111111',
            newContactPhone = '99999999999'

        it('allows to create new contact', function () {
            return smsc.phones({
                query: {
                    add: 1,
                    phone: contactPhone,
                    name: 'Contact From Test',
                }
            })
            .then(function (response) {
                assert(response.id)
            })
        })

        it('allows to add a contact to a blacklist', function () {
            return smsc.phones({
                query: {
                    add_black: 1,
                    phone: contactPhone
                }
            })
            .then(function (response) {
                assert(response.id)
            })
        })

        it('allows to remove a contact from a blacklist', function () {
            return smsc.phones({
                query: {
                    del_black: 1,
                    phone: contactPhone
                }
            })
            .then(function (response) {
                assert.equal(response.OK, true)
            })
        })

        it('allows to list contacts', function () {
            return smsc.phones({
                query: {
                    get: 1,
                }
            })
            .then(function (response) {
                var contact = {}
                response.some(function (c) {
                    var found = c.phone === contactPhone
                    if (found) { contact = c }
                    return found
                })
                assert.equal(contact.phone, contactPhone)
                assert.equal(contact.name, 'Contact From Test')
            })
        })

        it('allows to change phone number of a contact', function () {
            return smsc.phones({
                query: {
                    chg: 1,
                    phone: contactPhone,
                    new_phone: newContactPhone,
                }
            })
            .then(function (response) {
                assert.equal(response.OK, true)
            })
        })

        it('allows to drop a contact', function () {
            return smsc.phones({
                query: {
                    del: 1,
                    phone: newContactPhone,
                }
            })
            .then(function (response) {
                assert.equal(response.OK, true)
            })
        })

    })

    context('group-related functionality', function () {

        var contactPhone = '11111111111'
        var anotherContactPhone = '99999999999'
        var groupId

        before(function () {
            return smsc.phones({
                query: {
                    add: 1,
                    phone: contactPhone,
                    name: 'Contact From Test',
                }
            })
            .then(function () {
                return smsc.phones({
                    query: {
                        add: 1,
                        phone: anotherContactPhone,
                        name: 'Another Contact From Test',
                    }
                })
            })
        })

        after(function () {
            return smsc.phones({
                query: {
                    del: 1,
                    phone: contactPhone,
                }
            })
            .then(function () {
                return smsc.phones({
                    query: {
                        del: 1,
                        phone: anotherContactPhone,
                    }
                })
            })
        })

        it('allows to create new contact group', function () {
            return smsc.phones({
                query: {
                    add_group: 1,
                    name: 'Group From Test',
                }
            })
            .then(function (response) {
                assert(response.id)
                groupId = response.id
            })
        })

        it('allows to list groups', function () {
            return smsc.phones({
                query: {
                    get_group: 1,
                }
            })
            .then(function (response) {
                var group = {}
                response.some(function (c) {
                    var found = c.id === groupId
                    if (found) { group = c }
                    return found
                })
                assert.equal(group.id, groupId)
                assert.equal(group.name, 'Group From Test')
            })
        })

        it('allows to change contact group name', function () {
            return smsc.phones({
                query: {
                    chg_group: 1,
                    grp: groupId,
                    name: 'From Test Group',
                }
            })
            .then(function (response) {
                assert.equal(response.OK, true)
            })
        })


        it('allows to add a contact to a group', function () {
            return smsc.phones({
                query: {
                    move_group: 1,
                    grp: groupId,
                    phone: contactPhone,
                }
            })
            .then(function (response) {
                assert.equal(response.OK, true)
            })
        })

        it('allows to add a group to a contact', function () {
            return smsc.phones({
                query: {
                    move_group: 2,
                    grp: groupId,
                    phone: anotherContactPhone,
                }
            })
            .then(function (response) {
                assert.equal(response.OK, true)
            })
        })

        it('allows to drop a contact from a group', function () {
            return smsc.phones({
                query: {
                    move_group: 3,
                    grp: groupId,
                    phone: contactPhone,
                }
            })
            .then(function (response) {
                assert.equal(response.OK, true)
            })
        })

        it('allows to drop a group', function () {
            return smsc.phones({
                query: {
                    del_group: 1,
                    grp: groupId,
                }
            })
            .then(function (response) {
                assert.equal(response.OK, true)
            })
        })

    })

})
