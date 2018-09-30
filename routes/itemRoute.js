const requireLogin = require('../middleware/requireLogin')
const guid = require('../services/guid')

module.exports = (app, Db, Item) => {
    app.get('/api/item/:stockId',requireLogin,(req,res) => {
        const stockId = req.params.stockId

        var result = Item.find({_stock: stockId.toString()})
        res.send(result)
    })
}