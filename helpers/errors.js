/**
 * Errores específicos para formularios incompletos o usuario no identificado
 * (por motivos de seguridad el último caso no distingue entre usuario y contraseña erróneos)
 */
class IdentificationError extends Error {
    constructor(){
        super("Incorrect user or password")
        this._status = { code: 404 }
        this._json = {
            errors: {
                user: "Incorrect email or password",
            },
            name: "IdentificationError"
        }
    }

    get code() { return this._status.code }

    toJSON() {
        return this._json
    }
}

class NotFound extends Error {
    constructor(a){
        let t = a.toString().slice(0,1).toUpperCase() + a.toString().slice(1).toLowerCase()
        t += ` Not Found`
        super(t)
        this._status = { code: 404 }
        this._json = {
            errors: {
                message: t,
            },
            name: "NotFound"
        }
    }

    get code() { return this._status.code }

    toJSON() { return this._json }
}

class MissingAttributes extends Error {
    constructor(...attributes) {
        super(attributes.join(', ') + ' fields/s was expected')
        this._status = { code: 400 }
        this._json = {}
        this._json.errors = {}
        this._json.name = "MissingAttributes"
        for (const attribute of attributes) 
            this._json.errors[attribute] = `${attribute} field was expected`
    }

    get code() { return this._status.code }

    toJSON() { return this._json }
}

module.exports = { MissingAttributes, IdentificationError, NotFound }