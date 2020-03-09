const mongoose = require('mongoose')
const Schema = mongoose.Schema
const HorseSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    about: String,
    age: Number,
    image: String,
    description: String
})

module.exports = mongoose.model('Horse', HorseSchema)
