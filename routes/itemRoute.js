const requireLogin = require('../middleware/requireLogin')
const guid = require('../services/guid')

module.exports = (app, Db, Item, Category, Transaction) => {
    app.get('/api/itemdetail/:itemId', requireLogin, (req,res) => {
        const itemId = req.params.itemId

        var result = Item.find({_id: itemId.toString(), _user: req.user.id.toString()})
        res.send(result[0])
    })

    app.get('/api/item/:stockId',requireLogin,(req,res) => {
        const stockId = req.params.stockId

        var result = Item.find({_stock: stockId.toString(), _user: req.user.id.toString()})
        res.send(result)
    })

    app.post('/api/item/get', requireLogin, (req,res) => {
        var {recordId} = req.body

        var result = Item.find({_user: req.user.id.toString(), _id: recordId.toString()})

        if(result.length == 1){
            res.send(result[0])
        }
        else{
            res.status(500).send("ข้อมูลผิดพลาด กรุณารีเฟรชหน้าหรือลองใหม่อีกครั้ง")
        }
    })

    app.post('/api/item/add', requireLogin, async (req,res) => {
        const {itemName, initialItem, itemWarning, cost, income, category, stockId, stockName} = req.body
        const item = await Item.findOne({itemName: itemName, _user: req.user.id.toString()})
        if(item){
            res.status(500).send("สินค้าชื่อนี้มีอยู่ในระบบแล้ว กรุณาลองใหม่อีกครั้ง")
            return 
        }
        const existCategory = Category.findOne({categoryNameTh: category, stockName: stockName.toString(),  _user: req.user.id.toString()})
        if(existCategory === null){
            res.status(500).send("หมวดหมู่สินค้าไม่ถูกต้อง กรุณาลองใหม่อีกครั้ง")
            return
        }
        var newItem = {
            itemName: itemName,
            itemRemaining: parseInt(initialItem),
            itemWarning: parseInt(itemWarning),
            cost: parseFloat(parseFloat(cost).toFixed(2)),
            revenue: parseFloat(parseFloat(income).toFixed(2)),
            formatCost: parseFloat(cost).toFixed(2),
            formatRevenue: parseFloat(income).toFixed(2),
            category: category,
            _user: req.user.id.toString(),
            _category: existCategory,
            _stock: stockId,
            _id: guid()
        }
        
        //save it
        try{
            await Item.insert(newItem)
        }
        catch(e){
            console.log(e)
            res.status(500).send("พบบางอย่างผิดพลาดที่ระบบข้อมูล", e)
        }
        finally{
            await Db.saveDatabase();
        }

        res.status(200).send("Created item successfully")
    })

    app.post('/api/item/quickImport', requireLogin, async (req,res) => {
        try{
            Transaction.insert(req.body)
        }
        catch(e){
            console.log(e)
            res.status(500).send("พบบางอย่างผิดพลาดที่ระบบข้อมูล", e)
        }
        finally{
            await Db.saveDatabase();
        }

        let isValidItemName = true
        var result = Item.findOne({itemName: req.body.itemName})
        if(result !== null){
            result.itemRemaining = result.itemRemaining + req.body.itemAmount
            try{
                Item.update(result)
            }
            catch(e){
                res.status(500).send("พบบางอย่างผิดพลาดที่ระบบข้อมูล", e)
                return
            }

            var result2 = Item.find({_stock: req.body._stock.toString(), _user: req.user.id.toString()})
            res.status(200).send(result2)
        }
        else{
            isValidItemName = false
        }

        if(isValidItemName === false){
            res.status(500).send("สินค้าไม่ถูกต้องหรือถูกลบไปจากคลังสินค้าไปแล้ว")
            return
        }
    })

    app.post('/api/item/quickExport', requireLogin, async (req,res) => {
        try{
            Transaction.insert(req.body)
        }
        catch(e){
            console.log(e)
            res.status(500).send("พบบางอย่างผิดพลาดที่ระบบข้อมูล", e)
        }
        finally{
            await Db.saveDatabase();
        }

        let isValidItemName = true
        var result = Item.findOne({itemName: req.body.itemName})
        if(result !== null){
            result.itemRemaining = result.itemRemaining - req.body.itemAmount
            try{
                Item.update(result)
            }
            catch(e){
                res.status(500).send("พบบางอย่างผิดพลาดที่ระบบข้อมูล", e)
                return
            }
            finally{
                await Db.saveDatabase();
            }
            var result2 = Item.find({_stock: req.body._stock.toString(), _user: req.user.id.toString()})
            res.status(200).send(result2)
        }
        else{
            isValidItemName = false
        }

        if(isValidItemName === false){
            res.status(500).send("สินค้าไม่ถูกต้องหรือถูกลบไปจากคลังสินค้าไปแล้ว")
            return
        }
    })

    app.post('/api/item/edit/:itemId', requireLogin, async (req,res) => {
        const {itemName, itemWarning, initialItem: itemRemaining, cost, income, category, isCreateTransaction, stockId, currentDay} = req.body
        const itemId = req.params.itemId
        var arr = category.split("(");
        const existCategory = await Category.findOne({categoryNameTh: arr[0], _user: req.user.id.toString()})
        if(!existCategory){
            res.status(500).send("หมวดหมู่สินค้าไม่ถูกต้อง กรุณาลองใหม่อีกครั้ง")
            return
        }
        const item = await Item.findOne({itemName: itemName, _id: { '$ne' : itemId.toString(), _user: req.user.id.toString() }})
        if(item){
            res.status(500).send("สินค้าชื่อนี้มีอยู่ในระบบแล้ว กรุณาลองใหม่อีกครั้ง")
            return 
        }
        var result = Item.findOne({_id: itemId.toString()})
        if(result){
            let diff = itemRemaining - result.itemRemaining
            try{
                result.itemName = itemName
                result.itemWarning = parseInt(itemWarning)
                result.itemRemaining = parseInt(itemRemaining)
                result.cost = parseFloat(parseFloat(cost).toFixed(2))
                result.revenue = parseFloat(parseFloat(income).toFixed(2))
                result.formatCost = parseFloat(cost).toFixed(2)
                result.formatRevenue = parseFloat(income).toFixed(2)
                result.category = category
                result._category = existCategory
                Item.update(result)

                if(isCreateTransaction === true){
                    if(diff > 0){
                        //import
                        let newTotal = result.cost * Math.abs(diff)
                        let newTransaction = {
                            _user: req.user.id.toString(),
                            _item: itemId,
                            _stock: stockId,
                            discount: 0,
                            formatDiscount: '0.00',
                            overcost: 0,
                            formatOvercost: '0.00',
                            itemName,
                            itemAmount: Math.abs(diff),
                            isUsedInMusicGang: false,
                            cost: parseFloat(parseFloat(result.cost).toFixed(2)),
                            formatCost: parseFloat(result.cost).toFixed(2),
                            total: newTotal,
                            formatTotal: parseFloat(newTotal).toFixed(2),
                            type: 'import',
                            _id : guid(),
                            day: currentDay,
                        }
                        Transaction.insert(newTransaction)
                    }
                    else if(diff < 0){
                        //export
                        let newTotal = result.revenue * Math.abs(diff)
                        let newTransaction = {
                            _user: req.user.id.toString(),
                            _item: result._id,
                            _stock: stockId,
                            discount: 0,
                            formatDiscount: '0.00',
                            overcost: 0,
                            formatOvercost: '0.00',
                            itemName,
                            itemAmount: Math.abs(diff),
                            isUsedInMusicGang: false,
                            revenue: parseFloat(parseFloat(result.revenue).toFixed(2)),
                            formatRevenue: parseFloat(result.revenue).toFixed(2),
                            total: newTotal,
                            formatTotal: parseFloat(newTotal).toFixed(2),
                            type: 'export',
                            _id : guid(),
                            day: currentDay,
                        }
                        console.log(newTransaction)
                        Transaction.insert(newTransaction)
                    }
                }
            }
            catch(e){
                console.log(e)
                res.status(500).send("พบบางอย่างผิดพลาดที่ระบบข้อมูล", e)
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
        
    })

    app.delete('/api/item/delete/:itemId',requireLogin,async (req,res) => {
        const itemId = req.params.itemId
        const {values} = req.body
        try{
            await Item.removeWhere({_id: itemId.toString()})
        }
        catch(e){
            res.status(500).send(e)
        }
        finally{
            await Db.saveDatabase();
        }
        try{
            var result = Item.find({_stock: values.stockId.toString()}) 
        }
        catch(e){
            res.status(500).send(e)
        }
        res.status(200).send(result)
    })
}