'use strict'
const question = require('../models/index').question
const {writeFile} = require('fs')
const {promisify} = require('util')
const {join} = require('path')
const uuid = require('uuid')

const write = promisify(writeFile)




async function createQuestion (req, h){
    
    let result, filename
    try {
        if (Buffer.isBuffer(req.payload.image)) {
            filename = `${uuid}.png`
            await write(join(__dirname,'..', 'public','uploads', filename), req.payload.image)
            
        }
        result = await question.create(req.payload, req.state.user, filename)
        console.log(`Pregunta creada con el ID: ${result}`)
    } catch (error) {
        console.error(`Ocurrió un error: ${error}`)

        return h.view('ask', {
            title: 'Crear pregunta',
            error: 'Problemas creando la pregunta'
        }).code(500).takeover()
    }

    return h.redirect(`/question/${result}`)
}
async function answerQuestion(req, h){
    if(!req.state.user){
        return h.redirect('/login')
    }
    let result
    try {
        result = await question.answer(req.payload, req.state.user)
        console.log(`Respuesta creada ${result}`)
        req.log('info ',`Respuesta creada ${result}`)
    } catch (error) {
        req.log('error', error)
    }
    return h.redirect(`/question/${req.payload.id}`)
}
async function setAnswerRight(req, h){
    if(!req.state.user){
        return h.redirect('/login')
    }
    let result
    try {
        result = await req.server.methods.setAnswerRight(req.params.questionID, req.params.answerID, req.state.user)
        console.log(result);
    } catch (error) {
        console.error(error)
    }

    return h.redirect(`/question/${req.params.questionID}`)
}

module.exports ={
    createQuestion,
    answerQuestion, 
    setAnswerRight
}