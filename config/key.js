
if(process.env.NODE_ENV === 'production'){
    //return prod key
    module.exports = require('./prod')
}else{
    //return dev key
    module.exports = require('./dev')
}