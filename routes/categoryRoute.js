const requireLogin = require('../middleware/requireLogin')
const mongoose = require('mongoose')

const Category = mongoose.model('categories')

module.exports = app => {
    app.get('/api/category',requireLogin,(req,res) => {
        Category.find({_user: req.user.id}, function(err,stock){
            if(err){
                res.status(500).send(err)
                throw err
            }
            res.send(stock)
        })
    })

    app.post('/api/category/new',requireLogin,async (req,res) => {
        const {categoryName, id} = req.body
        const stock = await Category.findOne({categoryName: categoryName})
        if(stock){
            res.status(500).send("This category name already exist")
        }
        const newCategory = new Category({
            categoryName,
            _user: req.user.id,
            _stock: id
        })

        await newCategory.save()

        await Category.find({},function(err,category){
            if(err){
                res.status(500).send(err)
                throw err
            }
            res.status(200).send(category)
        })
    })

    app.delete('/api/category/delete/:categoryId',requireLogin, async (req,res) => {
        const categoryId = req.params.categoryId
        await Category.deleteOne({_id: categoryId}, function(err){
            if(err){
                res.status(500).send(err)
                throw err
            }
        })

        await Category.find({},function(err,category){
            if(err){
                res.status(500).send(err)
                throw err
            }
            res.status(200).send(category)
        })
        
    })
}