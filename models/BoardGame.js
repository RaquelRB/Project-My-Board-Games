const mongoose = require('mongoose')
const Schema = mongoose.Schema

const boardgameSchema = new Schema({
    name: {type: String},
    image_url: {type: String},
    description: {type: String},
    max_players: {type: Number},
    min_playtime: {type: Number},
    max_playtime: {type: Number},
    min_age: {type: Number},
    price: {type: String},
    rules_url: {type: String},
    id: {type: String},
    owner: {type: Schema.Types.ObjectId},
    records: {type: [Object]}        
})


const BoardGame = mongoose.model('BoardGame', boardgameSchema)

module.exports = BoardGame