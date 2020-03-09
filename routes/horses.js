const router = require('express').Router()
const { Horse, Image } = require('../models')
const { onlyAdmin } = require('../middleware')
const { NotFound, MissingAttributes } = require('../helpers/errors')
const crypto = require('crypto')
const path = require('path')
const sharp = require('sharp')
router.route('/:id')
    .get(async function(req, res) {
        try {
            const horse = await Horse.findOne({_id: req.params.id}, '-__v').lean()
            if (!horse) throw new NotFound('horse')
            res.json(horse)
        } catch (e) {
            res.status( e.code || 400 ).json(e)
        }
    })
    .put( onlyAdmin, async function(req, res) {
        try {
            let horse = await Horse.findOneAndUpdate({_id: req.params.id}, { $set: req.body }).lean()
            if (!horse) throw new NotFound('horse')
            horse = await Horse.findOne({_id: req.params.id}, '-__v').lean()
            if (!horse) throw new NotFound('horse')
            res.json(horse)
        } catch (e) {
            res.status( r.code || 400 ).json(e)
        }
    })

router.post('/:id/images', async function(req, res) {
    const horse = await Horse.findOne({_id: req.params.id}).lean()
    if (!req.files.file) throw new MissingAttributes('file')
    let file = req.files.file
    const fileName = crypto.randomBytes(20).toString('hex') + '.' + file.name.match(/[\d\w\.\_-]*\.([\w]*)$/).pop()
    const filePath = path.join(__dirname, '../storage/public', fileName)
    sharp(file.data)
    .resize(1078, 640)
    .toFile( filePath )
    .then( s => {
        horse.image = '/api/horses/images/'+fileName
    })
})

router.get('/images/:name', async function(req, res) {
    try{
        res.sendFile(path.join(__dirname, '../storage/public/', req.params.name))
    }catch(e){
        res.status(404)
    }
})

router.route('/')
    .get(async function(req, res) {
        const horse = await Horse.find({}, '-__v').lean()
        res.json({data: horse})
    })
    .post( onlyAdmin, async function(req, res) {
        try {
            const horse = await Horse.create(req.body)
            res.json(horse)
        } catch (e) {
            res.status(400).json(e)
        }
    })

module.exports = router