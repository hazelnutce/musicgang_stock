const lowkie = require('lowkie')

const StockSchema = lowkie.Schema({
    stockName: String,
    description: String,
    tag: [String],
    _user: String,
    itemCount: Number,
    itemWarning: Number,
    itemDanger: Number,
})

module.exports = lowkie.model('stocks', StockSchema);