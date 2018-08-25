const mongoose = require('mongoose')
const Schema = mongoose.Schema

const StockSchema = new Schema({
    stockName: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    tag: [String],
    itemCount: {
        type: Number,
        default: 0
    },
    itemWarning: {
        type: Number,
        default: 0
    },
    itemDanger: {
        type: Number,
        default: 0
    },
    _user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    }
}, {timestamps: true})

mongoose.model('stocks',StockSchema)