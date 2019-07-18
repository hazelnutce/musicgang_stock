const requireLogin = require('../middleware/requireLogin')
const guid = require('../services/guid')

function checkNameAndYear(d1, d2) {
    return d1.getMonth() === d2.getMonth() &&
        d1.getFullYear() === d2.getFullYear();
}

module.exports = (app, Db, Transaction, Stock, Item) => {

    app.get('/api/transaction/findstock', requireLogin, (req,res) => {
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

    app.get('/api/transaction',requireLogin,(req,res) => {
        var result = Transaction.find({_user: req.user.id.toString()})
        res.send(result)
    })

    app.post('/api/transaction/add', requireLogin, async (req,res) => {
        var allItem = req.body

        var isValidItemName = true
        allItem.forEach((e) => {
            var result = Item.findOne({itemName: e.itemName})
            if(result !== null){
                //update item & stock property to transaction
                e._item = result._id
                e._stock = result._stock
                e._user = req.user.id.toString()

                //update amount of item
                if(e.type === "import"){
                    result.itemRemaining = result.itemRemaining + e.itemAmount
                }
                else{
                    result.itemRemaining = result.itemRemaining - e.itemAmount
                }

                try{
                    Item.update(result)
                }
                catch(e){
                    res.status(500).send("พบบางอย่างผิดพลาดที่ระบบข้อมูล", e)
                    return
                }
                
            }
            else{
                isValidItemName = false
            }
        })

        if(isValidItemName === false){
            res.status(500).send("สินค้าไม่ถูกต้องหรือถูกลบไปจากคลังสินค้าไปแล้ว")
            return
        }

        //already handle it all on front-end side
        //save it
        try{
            await Transaction.insert(allItem)
        }
        catch(e){
            res.status(500).send("พบบางอย่างผิดพลาดที่ระบบข้อมูล", e)
            return
        }
        finally{
            await Db.saveDatabase();
        }

        res.status(200).send("Created transaction successfully")
    }), 

    app.post('/api/transaction/edit', requireLogin, async (req,res) => {
        var allItem = req.body

        allItem._user = req.user.id.toString()
        var itemResult = Item.findOne({itemName: allItem.itemName})

        if(allItem.type === 'export'){
            var result = Transaction.findOne({_id: allItem._id})

            if(result && itemResult !== null){
                let oldItemName = result.itemName
                let oldAmount = result.itemAmount

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
                    result._item = itemResult._id
                    result._stock = itemResult._stock
                    Transaction.update(result)

                    //handle item here
                    let newItemName = allItem.itemName
                    let newAmount = allItem.itemAmount

                    if(oldItemName == newItemName){
                        itemResult.itemRemaining = itemResult.itemRemaining + oldAmount - newAmount
                        Item.update(itemResult)
                    }
                    else{
                        let itemResult2 = Item.findOne({itemName: oldItemName})
                        if(itemResult2 !== null){
                            itemResult.itemRemaining = itemResult.itemRemaining - newAmount
                            itemResult2.itemRemaining = itemResult2.itemRemaining + oldAmount
                            Item.update(itemResult)
                            Item.update(itemResult2)
                        }
                    }
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

            if(result && itemResult !== null){
                let oldAmount = result.itemAmount
                let oldItemName = result.itemName

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
                    result._item = itemResult._id
                    result._stock = itemResult._stock
                    Transaction.update(result)

                    //handle item here
                    let newItemName = allItem.itemName
                    let newAmount = allItem.itemAmount

                    if(oldItemName == newItemName){
                        itemResult.itemRemaining = itemResult.itemRemaining - oldAmount + newAmount
                        Item.update(itemResult)
                    }
                    else{
                        let itemResult2 = Item.findOne({itemName: oldItemName})
                        if(itemResult2 !== null){
                            itemResult.itemRemaining = itemResult.itemRemaining + newAmount
                            itemResult2.itemRemaining = itemResult2.itemRemaining - oldAmount
                            Item.update(itemResult)
                            Item.update(itemResult2)
                        }
                    }

                }
                catch(e){
                    res.status(500).send("มีข้อผิดพลาดในการนำเข้า กรุณาลองใหม่อีกครั้ง", e)
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
            var result = Transaction.findOne({_id: id.toString()})
            await Transaction.removeWhere({_id: id.toString()})
            
            if(result != null){
                var itemResult = Item.findOne({itemName: result.itemName})
                if(itemResult != null){
                    if(result.type === 'import'){
                        itemResult.itemRemaining = itemResult.itemRemaining - result.itemAmount
                    }
                    else if(result.type === 'export'){
                        itemResult.itemRemaining = itemResult.itemRemaining + result.itemAmount
                    }
                }
            }
        }
        catch(e){
            res.status(500).send("มีข้อผิดพลาดในการนำคืนสินค้า", e)
        }
        finally{
            await Db.saveDatabase();
        }

        res.status(200).send("Deleted transaction successfully")
    })

    app.post('/api/transaction/getTotalImport/:month',requireLogin, async (req,res) => {
        const month = req.params.month

        var currentYear = parseInt(month / 12)
        var currentMonth = month % 12

        var currentDateInstance = new Date(currentYear, currentMonth)

        var result = Transaction.where((obj) => {
            return obj._user == req.user.id.toString() && checkNameAndYear(currentDateInstance, new Date(obj.day)) && obj.type == "import";
        })

        var resultTotal = 0

        if(result.length > 0){
            resultTotal = result.reduce(function(prev, cur) {
                return prev + cur.total;
            }, 0)
        }

        res.send(resultTotal.toString())
    })

    app.post('/api/transaction/getTotalExport/:month',requireLogin, async (req,res) => {
        const month = req.params.month

        var currentYear = parseInt(month / 12)
        var currentMonth = month % 12

        var currentDateInstance = new Date(currentYear, currentMonth)

        var result = Transaction.where((obj) => {
            return obj._user == req.user.id.toString() && checkNameAndYear(currentDateInstance, new Date(obj.day)) && obj.type == "export";
        })

        var resultTotal = 0

        if(result.length > 0){
            resultTotal = result.reduce(function(prev, cur) {
                return prev + cur.total;
            }, 0)
        }

        res.send(resultTotal.toString())
    })
}