const auth = {
    user: '',
    password: '',
    db: 'horses',
    dbAuth: '',
    host: process.env.docker ? 'mongo' : 'localhost',
    port: process.env.docker ? '27018' : '27017'
}

module.exports = auth