const requireLogin = require('../middleware/requireLogin')
const guid = require('../services/guid')

module.exports = (app, Db, Musicroom) => {
    app.get('/api/musicroom',requireLogin,(req,res) => {
        var result = Musicroom.find({_user: req.user.id.toString()})
        res.send(result)
    })

    app.post('/api/musicroom/add', requireLogin, async (req,res) => {
        var allItem = req.body

        allItem.forEach((e) => {
            e._user = req.user.id.toString()
        })

        //already handle it all on front-end side
        //save it
        try{
            await Musicroom.insert(allItem)
        }
        catch(e){
            res.status(500).send("พบบางอย่างผิดพลาดที่ระบบข้อมูล", e)
            return
        }
        finally{
            await Db.saveDatabase();
        }

        res.status(200).send("Created musicroom transaction successfully")
    })

    app.delete('/api/musicroom/delete/:itemId',requireLogin,async (req,res) => {
        const musicroomId = req.params.itemId

        try{
            await Musicroom.removeWhere({_id: musicroomId.toString()})
        }
        catch(e){
            res.status(500).send(e)
        }
        finally{
            await Db.saveDatabase();
        }

        try{
            var result = Musicroom.find({_user: req.user.id.toString()})
        }
        catch(e){
            res.status(500).send(e)
        }

        res.status(200).send(result)
    })
}