const mongoose = require('mongoose')
const auth = require('./credentials/db')
mongoose.connect(`mongodb://${auth.host}:${auth.port}/${auth.db}`,
{ useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true, useFindAndModify: false })

const app = require('./routes')
const http = require('http').Server(app)
const PORT = 3000

app.get('/', function (req, res) {
    res.send('OK')
})

http.listen(PORT, () => {console.log(`Iniciado en http://localhost:${PORT}`)})