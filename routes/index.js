/**
 * Se definen rutas principales
 * El nombre del archivo corresponde a la ruta principal
 * Ejemplo:
 *      Ruta '/:id' dentro del archivo 'items.js' => /api/items/:id
 */
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
// const cors = require('cors')
const files = require('../helpers/files')
var fileupload = require("express-fileupload");

// app.use(cors())
app.use(fileupload());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

files.list(__dirname).forEach( e => app.use(`/api/${e}`, require(`./${e}`)));
module.exports = app