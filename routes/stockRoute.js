const requireLogin = require('../middleware/requireLogin');
const guid = require('../services/guid')

module.exports = (app, Db, Stock) => {
    app.get('/api/stock',requireLogin,(req,res) => {
        var result = Stock.find({_user: req.user.id.toString()})
        res.send(result)
    })

    app.get('/api/stock/stockName',requireLogin,(req,res) => {
        var result = Stock.find({_user: req.user.id.toString()},{stockName: 1,_id: 1})
        res.send(result)
    })

    app.post('/api/stock/add',requireLogin,async (req,res) => {
        const {stockName, description} = req.body
        const stock = await Stock.findOne({stockName: stockName})
        if(stock){
            res.status(500).send("This stock name already exist")
        }
        //new data
        var newStock = {
            stockName: stockName,
            description: description,
            tag: [],
            _user: req.user.id.toString(),
            itemCount: 0,
            itemWarning: 0,
            itemDanger: 0,
            _id: guid()
        }
        newStock.tag.push(stockName)

        //save it
        try{
            await Stock.insert(newStock)
        }
        catch(e){
            console.log(e)
            res.status(500).send("something error on database", e)
        }
        finally{
            await Db.saveDatabase();
        }

        res.status(200).send("Created stock successfully")
    })

    app.delete('/api/stock/delete/:stockId',requireLogin,async (req,res) => {
        const stockId = req.params.stockId
        console.log(stockId)
        try{
            await Stock.removeWhere({_id: stockId.toString()})
        }
        catch(e){
            res.status(500).send(e)
        }
        finally{
            await Db.saveDatabase();
        }
        
        res.status(200).send("Deleted stock successfully")
    })
}