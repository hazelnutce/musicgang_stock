const requireLogin = require('../middleware/requireLogin')

function checkNameAndYear(d1, d2) {
    return d1.getMonth() === d2.getMonth() &&
        d1.getFullYear() === d2.getFullYear();
}

module.exports = (app, Db, Transaction, Cost, Musicroom) => {
    app.post('/api/summary/fetchTransactionByMonth', requireLogin, async (req,res) => {
        console.log(req.body)
        let {month} = req.body
        let allTransaction = {}

        var currentYear = parseInt(month / 12)
        var currentMonth = month % 12

        var currentDateInstance = new Date(currentYear, currentMonth)

        var musicroomResult = await Musicroom.where((obj) => {
            return obj._user == req.user.id.toString() && checkNameAndYear(currentDateInstance, new Date(obj.day));
        })

        allTransaction.musicroom = musicroomResult

        var costResult = await Cost.where((obj) => {
            return obj._user == req.user.id.toString() && checkNameAndYear(currentDateInstance, new Date(obj.day));
        })

        allTransaction.cost = costResult

        var transactionResult = await Transaction.where((obj) => {
            return obj._user == req.user.id.toString() && checkNameAndYear(currentDateInstance, new Date(obj.day));
        })

        allTransaction.transaction = transactionResult

        res.send(allTransaction)
    })
}