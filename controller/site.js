const { func } = require("joi")
const questions = require("../models/index").question

function register(req, h){
    if (req.state.user) {
        return h.redirect('/')
    }
    // Contrario a antes que habiamos colocado h.file cargaremos toda una vista
    // Por eso se llama h.view y de allí pondremos el archivo que cargará en la variable 
    // content y la variable que irá en el titulo
    return h.view('register', {
        title: 'Registro',
        user: req.state.user
    })
}
function login(req, h){
    if (req.state.user) {
        return h.redirect('/')
    }
    // Contrario a antes que habiamos colocado h.file cargaremos toda una vista
    // Por eso se llama h.view y de allí pondremos el archivo que cargará en la variable 
    // content y la variable que irá en el titulo
    return h.view('login', {
        title: 'Inicie Sesion',
        user: req.state.user
    })
}
async function viewQuestion(req, h){
    let data
    try {
        data = await questions.getOne(req.params.id)
        if (!data){
            return notFound(req,h)
        }

    } catch (error) {
        console.error(error)
    }
    return h.view('question', {
        title: 'Detalles de la pregunta',
        user: req.state.user,
        question: data,
        key: req.params.id
    })
}
function ask(req, h){
    if (!req.state.user) {
        return h.redirect('/login')
    }

    return h.view('ask',{
        title: 'Crear Pregunta',
        user: req.state.user,
    })
}
function notFound(req, h) {
    return h.view('404', {}, {
        layout: 'errLayout'
    })  .code(404)
}
//Se crea una funcion para que con cualquier archivo que no se encuentrre retorne un error
//404
function fileNotFound(req, h){
    const response = req.response
    //Preguntamos que si la response es un mensaje de boom y si el codigo es 404
    if (!req.path.startsWith('/api') && response.isBoom && response.output.statusCode === 404) {
        //Retornamos la vista de la pagina que muestra el error 404 de una forma visual mas agradable
        return h.view('404', {}, {
            layout: 'errLayout'
        })  .code(404)
    }

    return h.continue
}
async function home(req, h){
    const data = await req.server.methods.getLast(10)
    // Contrario a antes que habiamos colocado h.file cargaremos toda una vista
    // Por eso se llama h.view y de allí pondremos el archivo que cargará en la variable 
    // content y la variable que irá en el titulo
    return h.view('index', {
        title: 'Home',
        user: req.state.user,
        questions: data
    })
}

module.exports = {
    register: register,
    login: login,
    notFound: notFound,
    fileNotFound: fileNotFound,
    home: home,
    ask: ask,
    viewQuestion
}