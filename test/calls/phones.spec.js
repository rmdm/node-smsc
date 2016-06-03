describe('phones api call', function () {

    var contactPhone = '11111111111'

    context('contact-related functionality', function () {

        context('creation', function () {

            afterEach(function () {
                return smsc.phones({
                    del: 1,
                    phone: contactPhone,
                })
            })

            it('allows to create new contact', function () {
                return smsc.phones({
                    add: 1,
                    phone: contactPhone,
                    name: 'Contact From Test',
                })
                .then(function (response) {
                    assert(response.id)
                })
            })

        })

        context('manipulation', function () {

            var newContactPhone = '99999999999'
            var currentPhone

            before(function () {
                return smsc.phones({
                    add: 1,
                    phone: contactPhone,
                    name: 'Contact From Test',
                })
            })

            after(function () {
                return smsc.phones({
                    del: 1,
                    phone: currentPhone,
                })
            })

            it('allows to add a contact to a blacklist', function () {
                return smsc.phones({
                    add_black: 1,
                    phone: contactPhone,
                })
                .then(function (response) {
                    assert(response.id)
                    currentPhone = contactPhone
                })
            })

            it('allows to remove a contact from a blacklist', function () {
                return smsc.phones({
                    del_black: 1,
                    phone: contactPhone,
                })
                .then(function (response) {
                    assert.equal(response.result, 'OK')
                    currentPhone = contactPhone
                })
            })

            it('allows to list contacts', function () {
                return smsc.phones({
                    get: 1,
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
                    currentPhone = contactPhone
                })
            })

            it('allows to change phone number of a contact', function () {
                return smsc.phones({
                    chg: 1,
                    phone: contactPhone,
                    new_phone: newContactPhone,
                })
                .then(function (response) {
                    assert.equal(response.result, 'OK')
                    currentPhone = newContactPhone
                })
            })

        })

        context('deletion', function () {

            beforeEach(function () {
                return smsc.phones({
                    add: 1,
                    phone: contactPhone,
                    name: 'Contact From Test',
                })
            })

            it('allows to drop a contact', function () {
                return smsc.phones({
                    del: 1,
                    phone: contactPhone,
                })
                .then(function (response) {
                    assert.equal(response.result, 'OK')
                })
            })

        })

    })

    context('group-related functionality', function () {

        var contactPhone = '11111111111'

        context('creation', function () {

            var groupId

            afterEach(function () {
                return smsc.phones({
                    del_group: 1,
                    grp: groupId,
                })
            })

            it('allows to create new contact group', function () {
                return smsc.phones({
                    add_group: 1,
                    name: 'Group From Test',
                })
                .then(function (response) {
                    assert(response.id)
                    groupId = response.id
                })
            })

        })

        context('manipulation', function () {

            var anotherContactPhone = '99999999999'
            var groupId

            before(function () {
                return smsc.phones({
                    add_group: 1,
                    name: 'Group From Test',
                })
                .then(function (response) {
                    groupId = response.id
                })
            })

            after(function () {
                return smsc.phones({
                    del_group: 1,
                    grp: groupId,
                })
            })

            before(function () {
                return smsc.phones({
                    add: 1,
                    phone: contactPhone,
                    name: 'Group Contact From Test',
                })
                .then(function () {
                    return smsc.phones({
                        add: 1,
                        phone: anotherContactPhone,
                        name: 'Another Group Contact From Test',
                    })
                })
            })

            after(function () {
                return smsc.phones({
                    del: 1,
                    phone: contactPhone,
                })
                .then(function () {
                    return smsc.phones({
                        del: 1,
                        phone: anotherContactPhone,
                    })
                })
            })

            it('allows to list groups', function () {
                return smsc.phones({
                    get_group: 1,
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
                    chg_group: 1,
                    grp: groupId,
                    name: 'From Test Group',
                })
                .then(function (response) {
                    assert.equal(response.result, 'OK')
                })
            })


            it('allows to add a contact to a group', function () {
                return smsc.phones({
                    move_group: 1,
                    grp: groupId,
                    phone: contactPhone,
                })
                .then(function (response) {
                    assert.equal(response.result, 'OK')
                })
            })

            it('allows to add a group to a contact', function () {
                return smsc.phones({
                    move_group: 2,
                    grp: groupId,
                    phone: anotherContactPhone,
                })
                .then(function (response) {
                    assert.equal(response.result, 'OK')
                })
            })

            it('allows to drop a contact from a group', function () {
                return smsc.phones({
                    move_group: 3,
                    grp: groupId,
                    phone: contactPhone,
                })
                .then(function (response) {
                    assert.equal(response.result, 'OK')
                })
            })

        })

        context('deletion', function () {

            var groupId

            beforeEach(function () {
                return smsc.phones({
                    add_group: 1,
                    name: 'Group From Test',
                })
                .then(function (response) {
                    groupId = response.id
                })
            })

            it('allows to drop a group', function () {
                return smsc.phones({
                    del_group: 1,
                    grp: groupId,
                })
                .then(function (response) {
                    assert.equal(response.result, 'OK')
                })
            })

        })

    })

})
