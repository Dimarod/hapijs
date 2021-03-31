const users = require('../models/index').users
const Boom = require('@hapi/boom')

async function createUser(req, h) {
        let result
        try {
            result = await users.create(req.payload)
        } catch (error) {
            console.error(error);
            return h.view('register', {
                title: 'Registro',
                error: 'Problemas al crear el usuario'
            })
        }

        return h.view('register', {
            title: 'Registro',
            success: 'Usuario creado exitosamente'
        })
}

async function validateUser(req, h) {
    let result
    try {
        result = await users.validateUser(req.payload)
        if (!result) {
            return h.view('login', {
                title: 'Ingrese',
                error: 'Email o password incorrectos'
            })   
        }
    } catch (error) {
        console.error(error);
        return h.view('login', {
            title: 'Ingrese',
            error: 'Problemas validando el usuario'
        })
    }
    return h.redirect('/').state('user',{
        name: result.name,
        email: result.email
    })
}
function logout(req, h) {
    return h.redirect('/login').unstate('user')
}

function failValidation(req, h, err) {
    const template = {
        '/create-user': 'register',
        '/validate-user': 'login',
        '/create-question': 'ask'
    }

    //Se indica la plantilla que se debe imprimir a la hora de retornar
    //req.path ayuda al template a saber desde cual de las dos rutas es que se está mandando
    //el error
    return h.view(template[req.path], {
        title: 'Error de valdacion',
        err: err.output.payload.message,
    }).code(400).takeover()
}

module.exports = {
    createUser : createUser,
    validateUser: validateUser,
    logout: logout,
    failValidation: failValidation
}