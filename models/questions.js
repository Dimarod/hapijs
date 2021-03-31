'use strict'

class Questions {
    constructor(db){
        this.db = db,
        this.ref = this.db.ref('/'),
        this.collection = this.ref.child('questions')
    }   
    async create(info, user, filename){
        const data = {
            description: info.description,
            title: info.title,
            owner: user
        }
        if (filename) {
            data.filename = filename
        }
        const question = this.collection.push()
        question.set(data)

        return question.key
    }
    //Recuperar preguntas de firebase
    //amount es el numero de preguntas que se quieren recuperar
    async getLastQuestion (amount){
        //La query obtiene desde la coleccion de firebase cierta cantidad de respuestas
        //limitToLast y con el valor amount indican cuantas de las ultimas recogerá
        const query = await this.collection.limitToLast(amount).once('value')
        //se obtiene el valor
        const data = query.val()
        return data

    }
    async getOne (id) {
        const query = await this.collection.child(id).once('value')
        const data = query.val()
        return data
    }
    async answer (data, user) {
        const answers = await this.collection.child(data.id).child('answers').push()
        answers.set({text: data.answer, user: user})
        return answers
    }

    async setAnswerRight (questionID, answerID, user){
        const query = await this.collection.child(questionID).once('value')
        const question = query.val()
        const answers = question.answers

        if(!user.email === question.owner.email) {
            return false
        }
        for (let key in answers) {
            answers[key].correct = (key === answerID)
        }
        const update = await this.collection.child(questionID).child('answers').update(answers)
        return update
    }
}


module.exports = Questions