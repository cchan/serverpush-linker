const htmlparser = require("htmlparser2")

module.exports = function(options) {
    let collectedLinks = []
    let parser = new htmlparser.Parser({
        onopentag: function(name, attribs){
            if(name === "script" && attribs.src) {
                collectedLinks.push([attribs.src, "script"])
            }
            if(name === "link" && attribs.rel === "stylesheet" && attribs.href) {
                collectedLinks.push([attribs.href, "style"])
            }
        }
    }, {decodeEntities: true})

    return function(req, res, next) {
        collectedLinks = []
        let origWrite = res.write.bind(res), origEnd = res.end.bind(res)
        let writes = []
        res.write = function(chunk, encoding, callback) {
            parser.write(chunk, encoding)
            writes.push([chunk, encoding, callback])
        }
        res.end = function(chunk, encoding, callback) {
            let header = res.get('Link') || ''
            if (header) header += ', '

            parser.end(chunk, encoding)
            res.set('Link', header + collectedLinks.map(([url, as]) => `<${url}>;as=${as};rel=preload`).join(', '))

            writes.forEach(w => origWrite(...w))
            return origEnd(chunk, encoding, callback)
        }
        next()
    }
}
