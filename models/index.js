'use strict'

const firebase = require('firebase-admin')
const serviceAccount = require('../config/firebase.json')


firebase.initializeApp({
    credential: firebase.credential.cert(serviceAccount),
    databaseURL: 'https://platzioverflow-931c6-default-rtdb.firebaseio.com/'

})

const db = firebase.database()
const Users = require('./users')
const Questions = require('./questions')


module.exports = {
    users: new Users(db),
    question: new Questions(db)
}