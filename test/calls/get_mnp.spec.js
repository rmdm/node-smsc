describe('get_mnp api call', function () {

    var Promise = require('promise')
    var fs = require('fs')

    var open = Promise.denodeify(fs.open)
    var read = Promise.denodeify(fs.read)
    var close = Promise.denodeify(fs.close)
    var unlink = Promise.denodeify(fs.unlink)

    it('returns list of mnp ported phone numbers when data parameter was passed', function () {

        var today = new Date()

        return smsc.get_mnp({
            query: {
                date: [
                    toFixedString(today.getDate(), 2, 2, '0'),
                    toFixedString(today.getMonth() + 1 % 12, 2, 2, '0'),
                    today.getFullYear()
                ].join('.')
            }
        })
        .then(function (response) {
            assert(Array.isArray(response))
        })

    })

    it('returns a readable stream of .csv file when date parameter was not passed', function () {

        var filename = __dirname + '/../fixtures/mnp_phones.csv'

        return smsc.get_mnp()
        .then(function (res) {
            return new Promise(function (resolve, reject) {
                res.pipe(fs.createWriteStream(filename))
                .once('finish', resolve)
                .once('error', reject)
            })
        })
        .then(function () {
            var expectedStart = 'Phone;mccmnc'
            var expetedBuf = new Buffer(expectedStart)
            var bufSize = expetedBuf.length
            var otherBuf = new Buffer(bufSize)

            otherBuf.fill(0)

            return open(filename, 'r')
            .then(function (fd) {
                var start = 0,
                    position = 0
                return read(fd, otherBuf, start, bufSize, position)
                .then(function () {
                    return close(fd)
                })
            })
            .then(function () {
                assert(expetedBuf.equals(otherBuf))
            })
        })
        .then(function () {
            return unlink(filename)
        })

    })

    function toFixedString (str, minlength, maxlength, fillWith) {
        str = String(str)

        while (str.length < minlength) {
            str = fillWith + str
        }

        str = str.length > maxlength ? str.slice(str.length - maxlength) : str

        return str
    }

})
