const requireLogin = require('../middleware/requireLogin')
const guid = require('../services/guid')
//const Category = mongoose.model('categories')

module.exports = (app, Db, Category) => {
    app.get('/api/category',requireLogin,(req,res) => {
        var result = Category.find({_user: req.user.id.toString()})
        res.send(result)
    })

    app.post('/api/category/new',requireLogin,async (req,res) => {
        const {categoryName, id} = req.body
        const stock = await Category.findOne({categoryName: categoryName})
        if(stock){
            res.status(500).send("This category name already exist")
        }
        const newCategory = {
            categoryName,
            _user: req.user.id.toString(),
            _stock: id,
            _id: guid()
        }

        //save it
        try{
            await Category.insert(newCategory)
        }
        catch(e){
            console.log(e)
            res.status(500).send("something error on database", e)
        }
        finally{
            await Db.saveDatabase();
        }

        var result = Category.find({_user: req.user.id.toString()})
        res.status(200).send(result)
    })

    app.delete('/api/category/delete/:categoryId',requireLogin, async (req,res) => {
        const categoryId = req.params.categoryId
        console.log(categoryId)
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