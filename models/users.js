'use strict'

const bcrypt = require('bcrypt')
const {
    object
} = require('joi')

//Creamos lo que será el modelo usuario
class Users {
    constructor(db) {
        this.db = db,
            this.ref = this.db.ref('/'),
            this.collection = this.ref.child('users')
    }

    async create(data) {
        const user = {
            ...data
        }
        user.password = await this.constructor.encrypt(user.password)
        const newUser = this.collection.push(user)
        console.log(data);
        newUser.set(user)

        return newUser.key
    }
    async validateUser(data) {
        // const user = {
        //     ...data
        // }
        const userQuery = await this.collection
        .orderByChild('email')
        .equalTo(data.email)
        .once('value')
        const userFound = userQuery.val()
        // console.log(userFound.password);
        if (userFound) {
            const userId = Object.keys(userFound)[0]

            const passRight =await bcrypt.compare(data.password, userFound[userId].password)
            console.log(data.password);
            console.log(userFound[userId].password);
            const result = (passRight) ? userFound[userId] : false

            return result

        }
        return false
    }
    static async encrypt(passwd) {
        const saltRound = 10
        const hashed = await bcrypt.hash(passwd, saltRound)

        return hashed
    }

}


module.exports = Users