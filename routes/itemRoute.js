const requireLogin = require('../middleware/requireLogin')
const guid = require('../services/guid')

module.exports = (app, Db, Item, Category) => {
    app.get('/api/itemdetail/:itemId', requireLogin, (req,res) => {
        const itemId = req.params.itemId

        var result = Item.find({_id: itemId.toString()})
        res.send(result[0])
    })

    app.get('/api/item/:stockId',requireLogin,(req,res) => {
        const stockId = req.params.stockId

        var result = Item.find({_stock: stockId.toString()})
        res.send(result)
    })

    app.post('/api/item/add', requireLogin, async (req,res) => {
        const {itemName, initialItem, itemWarning, cost, income, category, stockId} = req.body
        const item = await Item.findOne({itemName: itemName})
        if(item){
            res.status(500).send("สินค้าชื่อนี้มีอยู่ในระบบแล้ว กรุณาลองใหม่อีกครั้ง")
            return 
        }
        var arr = category.split("(");
        const existCategory = await Category.findOne({categoryNameTh: arr[0]})
        if(!existCategory){
            res.status(500).send("หมวดหมู่สินค้าไม่ถูกต้อง กรุณาลองใหม่อีกครั้ง")
            return
        }
        var newItem = {
            itemName: itemName,
            itemRemaining: parseInt(initialItem),
            itemWarning: parseInt(itemWarning),
            cost: parseFloat(parseFloat(cost).toFixed(2)),
            revenue: parseFloat(parseFloat(income).toFixed(2)),
            category: category,
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

    app.post('/api/item/edit/:itemId', requireLogin, async (req,res) => {
        console.log("edit route")
        const {itemName, itemWarning, cost, income, category} = req.body
        const itemId = req.params.itemId
        var arr = category.split("(");
        const existCategory = await Category.findOne({categoryNameTh: arr[0]})
        if(!existCategory){
            res.status(500).send("หมวดหมู่สินค้าไม่ถูกต้อง กรุณาลองใหม่อีกครั้ง")
            return
        }
        const item = await Item.findOne({itemName: itemName, _id: { '$ne' : itemId.toString() }})
        if(item){
            res.status(500).send("สินค้าชื่อนี้มีอยู่ในระบบแล้ว กรุณาลองใหม่อีกครั้ง")
            return 
        }
        var result = Item.findOne({_id: itemId.toString()})
        if(result){
            try{
                result.itemName = itemName
                result.itemWarning = parseInt(itemWarning)
                result.cost = parseFloat(parseFloat(cost).toFixed(2))
                result.revenue = parseFloat(parseFloat(income).toFixed(2))
                result.category = category
                result._category = existCategory
                Item.update(result)
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