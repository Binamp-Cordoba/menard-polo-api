const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ImageSchema = new Schema({
    url: String
})

module.exports = mongoose.model('Image', ImageSchema)
