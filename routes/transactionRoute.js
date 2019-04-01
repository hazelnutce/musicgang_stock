const requireLogin = require('../middleware/requireLogin')
const guid = require('../services/guid')

module.exports = (app, Db, Transaction, Stock) => {
    app.get('/api/transaction/findstock', requireLogin, (req,res) => {
        var result = Stock.find({_user: req.user.id.toString()})
        res.send(result)
    })

    app.get('/api/transaction',requireLogin,(req,res) => {
        var result = Transaction.find({_user: req.user.id.toString()})
        res.send(result)
    })

    app.post('/api/transaction/add', requireLogin, async (req,res) => {
        var allItem = req.body

        allItem.forEach((e) => {
            return(
              e._user = req.user.id.toString()
            )
        })

        //handle it all on front-end side
        //save it
        try{
            await Transaction.insert(allItem)
        }
        catch(e){
            res.status(500).send("พบบางอย่างผิดพลาดที่ระบบข้อมูล", e)
        }
        finally{
            await Db.saveDatabase();
        }

        res.status(200).send("Created transaction successfully")
    }), 

    app.post('/api/transaction/edit', requireLogin, async (req,res) => {
        var allItem = req.body

        allItem._user = req.user.id.toString()

        if(allItem.type === 'export'){
            var result = Transaction.findOne({_id: allItem._id})

            if(result){
                try{
                    result.itemName = allItem.itemName
                    result.itemAmount = allItem.itemAmount
                    result.discount = allItem.discount
                    result.overcost = allItem.overcost
                    result.isUsedInMusicGang = allItem.isUsedInMusicGang
                    result.revenue = allItem.revenue
                    result.total = allItem.total
                    result.formatRevenue = allItem.formatRevenue
                    result.formatTotal = allItem.formatTotal
                    result.formatOvercost = allItem.formatOvercost
                    result.formatDiscount = allItem.formatDiscount
                    result.day = allItem.day
                    Transaction.update(result)
                }
                catch(e){
                    res.status(500).send("มีข้อผิดพลาดในการนำออก กรุณาลองใหม่อีกครั้ง", e)
                }
                finally{
                    await Db.saveDatabase();
                }
                res.status(200).send(result)
            }
            else{
                res.status(500).send("สินค้าไม่ถูกต้อง กรุณาลองใหม่อีกครั้ง")
                return
            }
        }
        else if(allItem.type === 'import'){
            var result = Transaction.findOne({_id: allItem._id})

            if(result){
                try{
                    result.itemName = allItem.itemName
                    result.itemAmount = allItem.itemAmount
                    result.discount = allItem.discount
                    result.overcost = allItem.overcost
                    result.revenue = allItem.revenue
                    result.total = allItem.total
                    result.formatRevenue = allItem.formatRevenue
                    result.formatTotal = allItem.formatTotal
                    result.formatOvercost = allItem.formatOvercost
                    result.formatDiscount = allItem.formatDiscount
                    result.day = allItem.day
                    Transaction.update(result)
                }
                catch(e){
                    res.status(500).send("มีข้อผิดพลาดในการนำออก กรุณาลองใหม่อีกครั้ง", e)
                }
                finally{
                    await Db.saveDatabase();
                }
                res.status(200).send(result)
            }
            else{
                res.status(500).send("สินค้าไม่ถูกต้อง กรุณาลองใหม่อีกครั้ง")
                return
            }
        }
        else{
            res.status(500).send("พบบางอย่างผิดพลาดที่ระบบข้อมูล")
            return
        }

    })

    app.post('/api/transaction/refund', requireLogin, async (req,res) => {
        const {id} = req.body

        try{
            await Transaction.removeWhere({_id: id.toString()})
        }
        catch(e){
            res.status(500).send("มีข้อผิดพลาดในการนำคืนสินค้า", e)
        }
        finally{
            await Db.saveDatabase();
        }

        res.status(200).send("Deleted transaction successfully")
    })
}