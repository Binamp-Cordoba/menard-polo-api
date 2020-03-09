const fs = require('fs')

/**
 * Retorna un array con nombre de archivos (sin extensión) 
 * que se encuentran en la carpeta folder
 * Omite al archivo "index.js"
 */
module.exports.list = function(folder) {
    const files = []
    for (file of fs.readdirSync(folder)) {
        if (file == "index.js") continue;
        let f = file.match(/([\w.]*)\.[\w\d]*$/)
        if (!f) continue
        files.push( f.pop() )
    }
    return files
}