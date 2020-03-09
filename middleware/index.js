const { AccessToken } = require('../models')

module.exports = {
    async onlyUser(req, res, next) {
        const token = req.query.access_token || req.body.access_token
        if (!token) return res.status(401).json({error: 'Unauthorize'})
        const access_token = await AccessToken.findOne({value: token}).populate('user', '-password -__v').lean()
        if (!access_token) return res.status(403).json({error: 'Forbidden'})
        req.user = access_token.user
        next()
    },
    async onlyAdmin(req, res, next) {
        const token = req.query.access_token || req.body.access_token
        if (!token) return res.status(401).json({error: 'Unauthorize'})
        const access_token = await AccessToken.findOne({value: token}).populate('user', '-password -__v').lean()
        if (access_token && access_token.user && access_token.user.role == "ADMIN") next()
        else return res.status(403).json({error: 'Forbidden'})
    },
    async userIfAny(req, res, next) {
        const token = req.query.access_token || req.body.access_token
        let access_token
        if (token) access_token = await User.findOne({value: token}).populate('user', '-__v -password').lean()
        if (access_token) req.user = access_token.user
        next()
    }
}