const requireLogin = require('../middleware/requireLogin')
const handleString = require('../middleware/handleStringOnRequestBody')
const guid = require('../services/guid')

module.exports = (app, Db, Cost) => {
    app.get('/api/cost',requireLogin,(req,res) => {
        var result = Cost.find({_user: req.user.id.toString()})
        res.send(result)
    })

    app.post('/api/cost/get', requireLogin, (req, res) => {
        var {recordId} = req.body

        var result = Cost.find({_user: req.user.id.toString(), _id: recordId.toString()})

        if(result.length == 1){
            res.send(result[0])
        }
        else{
            res.status(500).send("ข้อมูลผิดพลาด กรุณารีเฟรชหน้าหรือลองใหม่อีกครั้ง")
        }
    })

    app.post('/api/cost/add', requireLogin, handleString, async (req,res) => {
        
        var allItem = req.body

        allItem._user = req.user.id.toString()
        allItem._id = guid()

        //already handle it all on front-end side
        //save it
        try{
            await Cost.insert(allItem)
        }
        catch(e){
            res.status(500).send("พบบางอย่างผิดพลาดที่ระบบข้อมูล", e)
            return
        }
        finally{
            await Db.saveDatabase();
        }

        try{
            var result2 = Cost.find({_user: req.user.id.toString()})
        }
        catch(e){
            res.status(500).send("พบบางอย่างผิดพลาดที่ระบบข้อมูล", e)
            return
        }
        res.send(result2)
    })

    app.delete('/api/cost/delete/:itemId',requireLogin,async (req,res) => {
        const costId = req.params.itemId

        try{
            await Cost.removeWhere({_id: costId.toString()})
        }
        catch(e){
            res.status(500).send(e)
        }
        finally{
            await Db.saveDatabase();
        }

        try{
            var result = Cost.find({_user: req.user.id.toString()})
        }
        catch(e){
            res.status(500).send(e)
        }

        res.status(200).send(result)
    })

    app.post('/api/cost/edit', requireLogin, handleString, async (req,res) => {
        const {_id, cost, formatCost, 
            description, costType, _stock, day} = req.body
        var result = Cost.findOne({_id})
        if(result){
            try{
                result._id = _id
                result.cost = cost
                result.formatCost = formatCost
                result.description = description
                result.costType = costType
                result._stock = _stock
                result.day = day
                Cost.update(result)
            }
            catch(e){
                res.status(500).send("พบบางอย่างผิดพลาดที่ระบบข้อมูล", e)
            }
            finally{
                await Db.saveDatabase();
            }
            res.status(200).send(result)
        }
        else{
            res.status(500).send("รายการไม่ถูกต้อง กรุณาลองใหม่อีกครั้ง")
            return
        }
    })
}