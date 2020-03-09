const mongoose = require('mongoose')
const crypto = require('crypto')
const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId
const Minutes = 60
const AccessTokenSchema = new Schema({
    user: {
        type: ObjectId,
        ref: 'User'
    },
    value: {
        type: String,
        default: () => crypto.randomBytes(16).toString('hex').toUpperCase()
    },
    expireAt: {
        type: Date,
        default: () => {
            let now = new Date()
            now.setMinutes( now.getMinutes() + Minutes )
            return now
        },
        expires: 1
    }
})

module.exports = mongoose.model('AccessToken', AccessTokenSchema)