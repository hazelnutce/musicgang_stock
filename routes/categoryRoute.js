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
}