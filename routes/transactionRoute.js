const requireLogin = require('../middleware/requireLogin')
const guid = require('../services/guid')

module.exports = (app, Db, Transaction, Stock) => {
    app.get('/api/transaction/findstock', requireLogin, (req,res) => {
        var result = Stock.find({_user: req.user.id.toString()})
        res.send(result)
    })
}