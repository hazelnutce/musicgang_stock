module.exports = (req,res,next) => {

    function iterateObject(obj){
        for(var p in obj){
            if(typeof obj[p] === 'string'){
                obj[p] = obj[p].trim()
            }
        }
    }

    if(Array.isArray(req.body)){
        for(var i in req.body){
            if(typeof i === 'object'){
                iterateObject(i)
            }
        }
    }
    else{
        if(typeof req.body === 'object'){
            iterateObject(req.body)
        }
    }

    next();
}