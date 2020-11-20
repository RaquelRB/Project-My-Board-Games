const mongoose = require('mongoose')
const Schema = mongoose.Schema

const boardgameSchema = new Schema({
    name: {type: String},
    image_url: {type: String},
    description: {type: String},
    // maxplayers: {type: String},
    // minplaytime: {type: Date},
    // maxplaytime: {type: Number},
    min_age: {type: String},
    price: {type: String},
    rules_url: {type: String},
    id: {type: String},
    owner: {type: Schema.Types.ObjectId}         
})


const BoardGame = mongoose.model('BoardGame', boardgameSchema)

module.exports = BoardGame