const router = require('express').Router()
const email = require('../helpers/email')

router.post('/', async function(req, res) {
    await email.send(req.body)
    res.send('OK')
})

module.exports = router