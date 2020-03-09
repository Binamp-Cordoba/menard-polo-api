const mongoose = require('mongoose')
const Schema = mongoose.Schema
const bcrypt = require('bcryptjs')
const { MissingAttributes, IdentificationError } = require('../helpers/errors')
const UserSchema = new Schema({
    name: String,
    email: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['USER', 'ADMIN'],
        default: 'USER'
    },
    password: {
        type: String,
        set: v => bcrypt.hashSync(v),
        required: true
    }
})

UserSchema.statics.login = async function({email, password}){
    if (!email && !password) throw new MissingAttributes('email', 'password')
    if (!email) throw new MissingAttributes('email')
    if (!password) throw new MissingAttributes('password')
    
    const user = await this.model('User').findOne({email}, '-__v').lean()
    if (!user) throw new IdentificationError()

    if (!bcrypt.compareSync(password, user.password)) throw new IdentificationError()

    const access_token = await this.model('AccessToken').create({
        user: user._id
    })

    return access_token

}

module.exports = mongoose.model('User', UserSchema)