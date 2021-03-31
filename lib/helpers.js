'use strict'

const hand = require('handlebars')

function registerHelpers() {
    hand.registerHelper('answerNumber', (answers) => {
        const keys = Object.keys(answers)
        return keys.length
    })


        hand.registerHelper('ifEquals', (a, b, options) => {
            if (a === b) {
                return options.fn(this)
            }
            return options.inverse(this)
        })
        return hand
}
module.exports = registerHelpers()