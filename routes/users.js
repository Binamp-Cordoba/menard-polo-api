const router = require('express').Router()
const { User, AccessToken } = require('../models')
const { onlyAdmin, onlyUser,userIfAny } = require('../middleware')
const { NotFound } = require('../helpers/errors')

router.route('/me')
    .get( onlyUser, async function(req, res) {
        try {
            const user = await User.findOne({_id: req.user._id}, '-__v -password').lean()
            if (!user) throw new NotFound('user')
            res.json(user)
        } catch (e) {
            res.status( e.code || 400 ).json(e)
        }
    })
    .post( onlyUser, async function(req, res) {
        try {
            delete req.body.access_token
            let user = await User.findOne({_id: req.user._id}).exec()
            if (!user) throw new NotFound('user')
            for (const attr in req.body) {
                user[attr] = req.body[attr]
            }
            await user.save()
            user = user.toJSON()
            delete user.password
            delete user.__v
            res.json(user)
        } catch (e) {
            res.status( e.code || 400 ).json(e)
        }
    })

router.post('/login', function(req, res) {
    User.login(req.body)
    .then( r => res.json({access_token: r.value, expireAt: r.expireAt}) )
    .catch( r => res.status(r.code || 400).json(r) )
})

router.post('/logout', onlyUser, function(req, res) {
    AccessToken.findOneAndDelete({value: req.body.access_token}).lean()
    .then( r => res.json(r) )
})

router.route('/:id')
    .get( onlyAdmin, async function(req, res) {
        try {
            const user = await User.findOne({_id: req.params.id}, '-__v').lean()
            if (!user) return res.status(404).json({error: 'Not Found'})
            res.json(user)
        } catch (e) {
            res.status(400).json(e)
        }
    })
    .put( onlyAdmin, async function(req, res) {
        try{
            let user = await User.findOne({_id: req.params.id}).exec()
            if (!user) return res.status(404).json({error: 'Not Found'})
            for (const attr in req.body) {
                user[attr] = req.body[attr]
            }
            await user.save()
            user = user.toJSON()
            delete user.password
            delete user.__v
            res.json(user)
        }catch(e) {
            res.status(400).json(e)
        }
    })

router.route('/')
    .get( onlyAdmin, async function(req, res) {
        const user = await User.find({}, '-__v').lean()
        res.json({data: user})
    })
    .post( userIfAny, async function(req, res) {
        try {
            if (!(req.user && req.user.role == "ADMIN")) delete req.body.role // Si no tiene privilegios de administrador, no puede seleccionarse el rol del usuario
            const user = await User.create(req.body)
            user = user.toJSON()
            user.password = undefined
            user.__v = undefined
            res.json(user)
        } catch(e) {
            res.status(400).jsonjson(e)
        }
    })

router.post('/first-admin', async function(req, res) {
    try{
        if ( await User.exists({role: 'ADMIN'}) ) return res.status(409).json({error: 'This resource is no longer available'})
        let user = await User.create(Object.assign({role: 'ADMIN'}, req.body))
        user = user.toJSON()
        user.password = undefined
        user.__v = undefined
        res.json(user)
    } catch(e) {
        res.status(400).json(e)
    }
})

module.exports = router