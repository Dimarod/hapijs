'use strict'
const question = require('../models/index').question

async function setAnswerRight(questionID, answerID, user){
    let result
    try {
        result = await question.setAnswerRight(questionID, answerID, user)
    } catch (error) {
        console.error(error)
        return false
    }
    return result
}
async function getLast(amount){
    let data
    try {
        data = await question.getLastQuestion(10)
    } catch (error) {
        console.error(error)
    }
    console.log('Se ejecutó el metodo');
    return data
}

module.exports ={
    setAnswerRight,
    getLast,
}