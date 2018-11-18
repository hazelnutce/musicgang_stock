const requireLogin = require('../middleware/requireLogin')
const guid = require('../services/guid')

module.exports = (app, Db, Item, Category) => {
    app.get('/api/item/:stockId',requireLogin,(req,res) => {
        const stockId = req.params.stockId

        var result = Item.find({_stock: stockId.toString()})
        res.send(result)
    })

    app.post('/api/item/add', requireLogin, async (req,res) => {
        const {itemName, initalItem, itemWarning, cost, income, category, stockId} = req.body
        const item = await Item.findOne({itemName: itemName})
        if(item){
            res.status(500).send("สินค้าชื่อนี้มีอยู่ในระบบแล้ว กรุณาลองใหม่อีกครั้ง")
            return 
        }
        const existCategory = await Category.findOne({categoryName: category})
        if(!existCategory){
            res.status(500).send("หมวดหมู่สินค้าไม่ถูกต้อง กรุณาลองใหม่อีกครั้ง")
            return
        }
        

        res.status(200).send("Created item successfully")
    })
}