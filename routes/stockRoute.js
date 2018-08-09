const requireLogin = require('../middleware/requireLogin');
const mongoose = require('mongoose')

const Stock = mongoose.model('stocks')

module.exports = app => {
    app.get('/api/stock',requireLogin,(req,res) => {
        Stock.find({}, function(err,stock){
            if(err){
                res.status(500).send(err)
                throw err
            }

            res.send(stock)
        })
    })

    app.post('/api/stock/add',requireLogin,async (req,res) => {
        const {stockName, description} = req.body
        const stock = await Stock.findOne({stockName: stockName})
        if(stock){
            res.status(500).send("This stock name already exist")
        }
        const newStock = new Stock({
            stockName: stockName,
            description: description
        })
        newStock.tag.push(stockName)
        await newStock.save()

        res.status(200).send("Created stock successfully")
    })
}