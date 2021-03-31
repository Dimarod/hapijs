//Colocamos las rutas en un archivo aparte, las volvemos un arreglo y las exportamos
'use strict'
const site = require('./controller/site')
const user = require('./controller/user')
const question = require('./controller/question')
const Joi = require('@hapi/joi')
const { users } = require('./models')
module.exports = [
    {
        method: 'GET',        
        path: '/',
        options:{
            cache: {
                expiresIn: 1000 * 30,
                privacy: 'private',
            }
        },
        handler: site.home
    },
    {
        method: 'GET',
        path: '/register',
        handler: site.register
    },
    {
        method: 'POST',
        options:{
            validate:{
                payload: Joi.object({
                    //Estos nombres o lo que sería la clave en el objeto o nombre de las 
                    //variables debe coincidir con el nombre o el valor que pusiste en el
                    //atributo from del formulario
                    name: Joi.string().required().min(3),
                    email: Joi.string().email().required(),
                    password: Joi.string().required().min(6)
                }),
                failAction: user.failValidation
            }
        },
        path: '/create-user',
        handler: user.createUser
    },
    {
        method: 'GET',
        path: '/login',
        handler: site.login
    },
    {
        method: 'GET',
        path: '/logout',
        handler: user.logout
    },
    {
        method: 'GET',
        path: '/ask',
        handler: site.ask
    },
    {
        method: 'GET',
        path: '/question/{id}',
        handler: site.viewQuestion
    },
    {
        method: 'POST',
        options:{
            validate:{
                payload: Joi.object({
                    //Estos nombres o lo que sería la clave en el objeto o nombre de las 
                    //variables debe coincidir con el nombre o el valor que pusiste en el
                    //atributo from del formulario
                    email: Joi.string().email().required(),
                    password: Joi.string().required().min(6)
                }),
                failAction: user.failValidation
            }
        },
        path: '/validate-user',
        handler: user.validateUser
    },
    {
        method: 'POST',
        options:{
            validate:{
                payload: Joi.object({
                    //Estos nombres o lo que sería la clave en el objeto o nombre de las 
                    //variables debe coincidir con el nombre o el valor que pusiste en el
                    //atributo from del formulario
                    title: Joi.string().required(),
                    description: Joi.string().required(),
                    image: Joi.any().optional()
                }),
                failAction: user.failValidation
            }
        },
        path: '/create-question',
        handler: question.createQuestion
    },
    {
        method: 'POST',
        options:{
            validate:{
                payload: Joi.object({
                    //Estos nombres o lo que sería la clave en el objeto o nombre de las 
                    //variables debe coincidir con el nombre o el valor que pusiste en el
                    //atributo from del formulario
                    answer: Joi.string().required(),
                    id: Joi.string().required()
                }),
                failAction: user.failValidation
            }
        },
        path: '/answer-question',
        handler: question.answerQuestion
    },
    {
        method: 'GET',
        path: '/answer/{questionID}/{answerID}',
        handler: question.setAnswerRight
    },
    {
        method: 'GET',
        path: '/assets/{param*}',
        handler: {
            directory: {
                path: '.',
                index: ['index.html']
            }
        }
    },
    {
        method:['GET', 'POST'],
        path: '/{any*}',
        handler: site.notFound
    }
]