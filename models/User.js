const mongoose = require('mongoose')
const crypto = require('crypto')
const Schema = mongoose.Schema

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

userSchema.pre('save',(next) => {
    if(this.password) {
        this.salt = new Buffer(
            crypto.randomBytes(16).toString('base64'),'base64'
        )
        this.password = crypto.pbkdf2Sync(
            password, this.salt, 10000, 64
        ).toString('base64')
    }

    next();
})

mongoose.model('users',userSchema)