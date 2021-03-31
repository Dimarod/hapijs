'use strict'
const basic = require('hapi-auth-basic')
const Joi = require('@hapi/joi')
const question = require('../models/index').question
const username = require('../models/index').users
const Boom = require('@hapi/boom')

module.exports ={
    name: 'api-rest',
    version: '1.0.0',
    async register(server,options){
        const prefix = options.prefix || 'api'

        await server.register(basic)
        server.auth.strategy('simple', 'basic', {validate: validateAuth})
        server.auth.default('simple')

        server.route({
            method: 'GET',
            path: `/${prefix}/question/{key}`,
            options: {
                auth: 'simple',
                validate: {
                    params:  Joi.object({
                        key: Joi.string().required(),
                    }),
                    failAction: failValidation
                }
            },
            handler: async (req, h)=>{
                let result 
                try {
                    result = await question.getOne(req.params.key)
                    if (!result){
                        return Boom.notFound('No se pudo encontrar la pregunta ' + req.params.key)
                    }
                } catch (error) {
                    return Boom.badImplementation(`Hubo un error al buscar la pregunta ${error.message} - ${req.params.key}`)
                }
                return result
            }   
        })

        server.route({
            method: 'GET',
            path: `/${prefix}/questions/{amount}`,
            options: {
                auth: 'simple',
                validate: {
                    params:  Joi.object({
                        amount: Joi.number().integer().min(2).max(10).required(),
                    }),
                     failAction: failValidation
                }
               
            },
            handler: async (req, h)=>{
                let result 
                try {
                    result = await question.getLastQuestion(req.params.amount)
                    if (!result){
                        return Boom.notFound('No se pudo encontrar las preguntas')
                    }
                } catch (error) {
                    return Boom.badImplementation(`Hubo un error al buscar las preguntas ${error.message}`)
                }
                return result
            }   
        })

        function failValidation(req, h, err){
            return Boom.badRequest('Por favor use los parametros correctamente')
        }
        async function validateAuth(req, name, pass, h){
            let user
            try {
                user = await username.validateUser({email: name, password: pass})
            } catch (error) {
               server.log('error ' + error.message)
            }
            return {
            credentials: user || {},
            isValid: (user !== false)
        }
        }
       
    }
}