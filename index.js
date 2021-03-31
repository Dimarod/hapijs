'use strict'

const hapi = require('@hapi/hapi')
const blankie = require('blankie')
const path = require('path')
const good = require('good')
const crumb = require('crumb')
const devErr = require('hapi-dev-errors')
//Plugins para plantillas de layout
const hand = require('./lib/helpers')
const method = require('./lib/methods')
const vision = require('vision')
const scooter = require('@hapi/scooter')
const routes = require('./routes')
const site = require('./controller/site')




const server = hapi.server({
    port: process.env.PORT || 3000,
    host: 'localhost',
    routes: {
        files: {
            relativeTo: path.join(__dirname, 'public')
        }
    }
})

async function init() {
    try {
        //Se debe registrar el plugin inert siempre que se vaya a usar
        await server.register(require('inert'))
        //Se registra el plugin para las plantillas
        await server.register(vision)
        await server.register({
            plugin: require('good'),
            options: {
                reporters:{
                    console: [{
                        module: require('good-console')
                    },
                    'stdout'
                ]
                }
            }
        })
        await server.register([scooter,{
            plugin: blankie,
            options: {
                defaultSrc: `'self' 'unsafe-inline'`,
                styleSrc: `'self' 'unsafe-inline' https://maxcdn.bootstrapcdn.com`,
                fontSrc: `'self' 'unsafe-inline' data:`,
                scriptSrc: `'self' 'unsafe-inline' https:// https://maxcdn.bootstrapcdn.com`,
                generateNonces: false,
            }
        }])
        await server.register({
            plugin: devErr,
            options: {
                showErrors: process.env.NODE_ENV !== 'production'
            }
        })
        await server.register({
            plugin: crumb,
            cookieOptions: {
                isSecure: process.env.NODE_ENV === 'prod'
            }
        })

        await server.register({
            plugin: require('./lib/api'),
            options: {
                prefix: 'api' 
            }
        })

        //Se registran los metodos de servidor
        server.method('setAnswerRight', method.setAnswerRight)
        server.method('getLast', method.getLast, {
            cache: {
                expiresIn: 1000 * 60,
                generateTimeout: 2000
            }
        })

        server.state('user', {
            //Time to leave
            ttl: 1000 * 60 * 60 *24,
            //Se certifica que el lugar sea seguro
            isSecure: process.env.NODE_ENV === 'prod',
            //Codificacion de la cookie
            encoding: 'base64json',
            //ruta
            path: '/'
            
        })
//Se configuran las vistas
        server.views({
            //Objeto necesario para los handlebars
            engines: {
                //Las extensiones hbs seran renderizadas como plantillas del modulo handlebars
                hbs: hand,

            },
//Dado que las vistas se establecen fuera del public se redirige para que vision busque las
//carpetas donde se encuentran las plantillas y se estabece el dir actual __dirname
            relativeTo: __dirname,
            //La ruta en la que buscará vision será en el folder llamado views
            path: 'views',
            //Para no repetir el codigo html en todas las plantillas se establece el layout a 
            //true
            // esto hará que cargue el archivo layout.hbs
            layout: true,
            //La ruta donde se va a buscar el layout es la carpeta views
            layoutPath: 'views'
        })

        server.ext('onPreResponse', site.fileNotFound)

        //Se traen las rutas al server para que puedan cargarse
        server.route(routes)
        await server.start()
    } catch (error) {
        console.error(error);
        process.exit(1)
    }
    server.log('info '+`Servidor corriendo en: ${server.info.uri}`)
}

process.on('unhandledRejection', err =>{
    server.log('unhandledRejection', err)
})
process.on('unhandledException', err =>{
    server.log('unhandledException', err)
})


init()