const requireLogin = require('../middleware/requireLogin')
const guid = require('../services/guid')

module.exports = (app, Db, Cost) => {
    app.get('/api/cost',requireLogin,(req,res) => {
        var result = Cost.find({_user: req.user.id.toString()})
        res.send(result)
    })

    app.post('/api/cost/add', requireLogin, async (req,res) => {
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
}