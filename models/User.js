const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
    username: {type: String, required: true},
    password: {type: String, required: true},
    boardgame_id: [{type: Schema.Types.ObjectId, ref: 'BoardGame'}]
})


const User = mongoose.model('User', userSchema)

module.exports = User
