const mongoose = require('mongoose')
const Schema = mongoose.Schema

const recordsSchema = new Schema({
    date: {type: String},
    players: {type: String},
    winner: {type: String},
    scores: {type: String},
    attachedFile: {type: String},
    boardgames: {type: String}  
})


const Record = mongoose.model('Record', recordsSchema)

module.exports = Record