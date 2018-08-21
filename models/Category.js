const mongoose = require('mongoose')
const Schema = mongoose.Schema

const CategorySchema = new Schema({
    categoryName: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    _user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    },
    _stock: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'stocks'
    }

}, {timestamps: true})

mongoose.model('categories',CategorySchema)