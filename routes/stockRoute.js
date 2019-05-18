const requireLogin = require('../middleware/requireLogin');
const guid = require('../services/guid')

module.exports = (app, Db, Stock, Item) => {
    app.get('/api/stock',requireLogin,(req,res) => {
        console.log('/api/stocks')
        var results = Stock.find({_user: req.user.id.toString()})
        results.forEach((result) => {
            result.itemCount = Item.find({_stock : result._id.toString()}).length
            result.itemWarning = Item.where((obj) => {
                return obj.itemRemaining <= obj.itemWarning && obj._stock == result._id.toString() && obj.itemRemaining != 0;
            }).length
            result.itemDanger = Item.find({_stock : result._id.toString(), itemRemaining : { '$eq' : 0 }}).length
        })
        res.send(results)
    })

    app.get('/api/stock/stockName',requireLogin,(req,res) => {
        console.log('/api/stock/stockName')
        var result = Stock.find({_user: req.user.id.toString()},{stockName: 1,_id: 1})
        res.send(result)
    })

    app.post('/api/stock/add',requireLogin,async (req,res) => {
        const {stockName, description} = req.body
        const stock = await Stock.findOne({stockName: stockName})
        if(stock){
            res.status(500).send("คลังสินค้าชื่อนี้มีอยู่ในระบบแล้ว กรุณาลองใหม่อีกครั้ง")
            return 
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
            res.status(500).send("พบบางอย่างผิดพลาดที่ระบบข้อมูล", e)
        }
        finally{
            await Db.saveDatabase();
        }

        res.status(200).send("Created stock successfully")
    })

    app.delete('/api/stock/delete/:stockId',requireLogin,async (req,res) => {
        const stockId = req.params.stockId
        try{
            await Item.findAndRemove({_stock : stockId.toString()})
            await Stock.removeWhere({_id: stockId})
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