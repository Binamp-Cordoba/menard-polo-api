const files = require('../helpers/files')
const cap = require('../helpers/capitalize')
const models = {}

files.list(__dirname).forEach( e => models[cap(e)] = require(`./${e}`) )

module.exports = models