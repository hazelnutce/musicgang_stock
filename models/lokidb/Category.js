const lowkie = require('lowkie')

const CategorySchema = lowkie.Schema({
    categoryName: String,
    _user: String,
    _stock: String
});

module.exports = lowkie.model('categories',CategorySchema);