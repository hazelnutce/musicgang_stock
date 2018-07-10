const mongoose = require('mongoose')
const crypto = require('crypto')
const password = require('crypto-password-helper')
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

// function hashPassword(password){
//     var salt = new Buffer(crypto.randomBytes(16).toString('base64'),'base64')
//     return crypto.pbkdf2Sync(password,salt,10000,64,"sha512").toString('base64')
// }

userSchema.pre('save', async function(next){
    var hashedPassword = await password.encrypt(this.password)
    this.password = hashedPassword
    next();
})

userSchema.methods.validPassword = async function(sentPassword){
    var hashedPassword = await password.encrypt(sentPassword)
    return await password.compare(this.password,hashedPassword)
}

mongoose.model('users',userSchema)

