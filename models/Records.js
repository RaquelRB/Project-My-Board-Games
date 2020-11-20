const mongoose = require('mongoose')
const Schema = mongoose.Schema

const recordsSchema = new Schema({
    // date: {type: Date},
    // Players: {type: String},
    // Winner: {type: String},
    // Scores: {type: String},
    // attached file: {type: String},     
})


const Record = mongoose.model('Record', recordSchema)

module.exports = Record