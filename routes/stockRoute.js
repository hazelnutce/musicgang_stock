const requireLogin = require('../middleware/requireLogin');
const mongoose = require('mongoose')
//const Stock = mongoose.model('stocks')

module.exports = (app, Stock) => {
    app.get('/api/stock',requireLogin,(req,res) => {
        var result = Stock.find({_user: req.user.id})

        res.send(result)
    })

    app.get('/api/stock/stockName',requireLogin,(req,res) => {
        var result = Stock.find({_user: req.user.id},{stockName: 1,_id: 1})
        
        res.send(result)
    })

    app.post('/api/stock/add',requireLogin,async (req,res) => {
        const {stockName, description} = req.body
        const stock = await Stock.findOne({stockName: stockName})
        if(stock){
            res.status(500).send("This stock name already exist")
        }
        const newStock = new Stock({
            stockName: stockName,
            description: description,
            _user: req.user.id
        })
        newStock.tag.push(stockName)
        await newStock.save()

        res.status(200).send("Created stock successfully")
    })

    app.delete('/api/stock/delete/:stockId',requireLogin,async (req,res) => {
        const stockId = req.params.stockId
        Stock.deleteOne({_id: stockId}, function(err){
            if(err){
                res.status(500).send(err)
                throw err
            }
        })

        res.status(200).send("Deleted stock successfully")
    })
}