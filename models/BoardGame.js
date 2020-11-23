const mongoose = require('mongoose')
const Schema = mongoose.Schema

const boardgameSchema = new Schema({
    name: {type: String},
    image_url: {type: String},
    description: {type: String},
    min_players: {type: Number},
    max_players: {type: Number},
    min_playtime: {type: Number},
    max_playtime: {type: Number},
    min_age: {type: Number},
    price: {type: String},
    rules_url: {type: String},
    id: {type: String},
    records_id: [{type: Schema.Types.ObjectId, ref: 'Record'}],
    owner: {type: Schema.Types.ObjectId, ref: 'User'}
})


const BoardGame = mongoose.model('BoardGame', boardgameSchema)

module.exports = BoardGame