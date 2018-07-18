const mongoose = require('mongoose')
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema
const hashPassword = require('../secrets/util')

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password : {
        type: String,
        required: true
    },
    item : {
        type: Number,
        default : 0
    }
})

mongoose.model('users',userSchema)

