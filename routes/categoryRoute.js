const requireLogin = require('../middleware/requireLogin')
const guid = require('../services/guid')
//const Category = mongoose.model('categories')

module.exports = (app, Db, Category, Item) => {
    app.get('/api/category',requireLogin,(req,res) => {
        var result = Category.find({_user: req.user.id.toString()})
        res.send(result)
    })

    app.post('/api/category/new',requireLogin, async (req,res) => {
        console.log("category new")
        const {categoryNameTh, categoryNameEn, labelColor, textColor, stockName} = req.body
        const stock = await Category.findOne({
            '$or' : [{
                categoryNameTh : categoryNameTh,
                _user: req.user.id.toString()
            },{
                categoryNameEn : categoryNameEn,
                _user: req.user.id.toString()
            }]
        });
        if(stock){
            res.status(500).send("หมวดหมู่นี้มีอยู่แล้ว กรุณาใช้ชื่ออื่นๆ")
            return
        }
        const newCategory = {
            categoryNameTh,
            categoryNameEn,
            labelColor,
            textColor,
            _user: req.user.id.toString(),
            stockName,
            _id: guid()
        }

        //save it
        try{
            await Category.insert(newCategory)
        }
        catch(e){
            console.log(e)
            res.status(500).send("something error on database", e)
            return
        }
        finally{
            await Db.saveDatabase();
        }

        var result = Category.find({_user: req.user.id.toString()})
        res.status(200).send(result)
    })

    app.post('/api/category/edit', requireLogin, async (req,res) => {
        const {categoryNameTh, categoryNameEn, labelColor, textColor, _id, stockName} = req.body

        const category = await Category.find({
            '$or' : [{
                        categoryNameTh : categoryNameTh
                    },{
                        categoryNameEn : categoryNameEn
                    }],
            _id : {'$ne' : _id.toString()},
            stockName : {'$eq' : stockName.toString()},
            _user: req.user.id.toString()
        });

        if(category != null && category.length !== 0){
            res.status(500).send("หมวดหมู่สินค้าชื่อนี้มีอยู่ในระบบแล้ว กรุณาลองใหม่อีกครั้ง")
            return 
        }
        var result = Category.findOne({_id: _id.toString()})
        if(result){
            try{
                result.categoryNameTh = categoryNameTh
                result.categoryNameEn = categoryNameEn
                result.labelColor = labelColor
                result.textColor = textColor
                Category.update(result)
            }
            catch(e){
                console.log(e)
                res.status(500).send("พบบางอย่างผิดพลาดที่ระบบข้อมูล", e)
                return
            }
            finally{
                await Db.saveDatabase();
            }
            res.status(200).send(result)
        }
        else{
            res.status(500).send("หมวดหมู่สินค้าไม่ถูกต้อง กรุณาลองใหม่อีกครั้ง")
            return
        }

    })

    app.delete('/api/category/delete/:categoryId',requireLogin, async (req,res) => {
        const categoryId = req.params.categoryId

        const item = Item.where((obj) => {
            return obj._category._id === categoryId.toString()
        })

        console.log(item)
        if(item != null && item.length !== 0){
            res.status(500).send("ไม่สามารถลบหมวดหมู่นี้ได้ กรุณาลบสินค้าทั้งหมดที่เกี่ยวข้องกับหมวดหมู่นี้")
            return 
        }

        try{
            await Category.removeWhere({_id: categoryId.toString()})
        }
        catch(e){
            res.status(500).send(e)
        }
        finally{
            await Db.saveDatabase();
        }

        var result = Category.find({_user: req.user.id.toString()})
        res.status(200).send(result)
        
    })
}