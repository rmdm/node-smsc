describe('templates api call', function () {

    var templateId

    before(function () {
        return smsc.templates({
            add: 1,
            name: 'existing-test-template',
            msg: 'Text of the existing test template.',
            format: 'sms',
        })
        .then(function (response) {
            assert(response.id)
            templateId = response.id
        })
    })

    it('allows to add new message template', function () {
        return smsc.templates({
            add: 1,
            name: 'test-template',
            msg: 'Text of the test template.',
            format: 'sms',
        })
        .then(function (response) {
            assert(response.id)
        })
    })

    it('allows to get list of available templates', function () {
        return smsc.templates({
            get: 1,
        })
        .then(function (templates) {
            var template = findById(templates, templateId)
            assert.equal(template.name.toLowerCase(), 'existing-test-template')
            assert.equal(template.message, 'Text of the existing test template.')
        })
    })

    it('allows to change a template', function () {
        return smsc.templates({
            chg: 1,
            id: templateId,
            msg: 'Changed text of the existing test template.',
        })
        .then(function () {
            return smsc.templates({get: 1})
        })
        .then(function (templates) {
            var templateAfterChange = findById(templates, templateId)
            assert.equal(templateAfterChange.message, 'Changed text of the existing test template.')
        })
    })

    it('allows to remove a template', function () {
        return smsc.templates({
            del: 1,
            id: templateId,
        })
        .then(function () {
            return smsc.templates({get: 1})
        })
        .then(function (templates) {
            var template = findById(templates, templateId)
            assert(template == null)
        })
    })

    function findById (templates, id) {
        for (var i = 0; i < templates.length; i++) {
            if (templates[i].id == id) { return templates[i] }
        }
        return null
    }

})

