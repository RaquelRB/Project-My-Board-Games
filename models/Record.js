const mongoose = require('mongoose')
const Schema = mongoose.Schema

const recordSchema = new Schema({
    date: {type: String},
    players: {type: String},
    winner: {type: String},
    scores: {type: String},
    attachedFile_name: {type: String},
    attachedFile_path: {type: String},
    linkedGame: {type: Schema.Types.ObjectId, ref: 'Boardgame'}
})


const Record = mongoose.model('Record', recordSchema)

module.exports = Record