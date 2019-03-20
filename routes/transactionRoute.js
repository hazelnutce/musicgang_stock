const requireLogin = require('../middleware/requireLogin')
const guid = require('../services/guid')

module.exports = (app, Db, Transaction, Stock) => {
    app.get('/api/transaction/findstock', requireLogin, (req,res) => {
        var result = Stock.find({_user: req.user.id.toString()})
        res.send(result)
    })

    app.get('/api/transaction',requireLogin,(req,res) => {
        var result = Transaction.find({_user: req.user.id.toString()})
        res.send(result)
    })

    app.post('/api/transaction/add', requireLogin, async (req,res) => {
        console.log(req.body)
        var allItem = req.body

        allItem.forEach((e) => {
            return(
              e._user = req.user.id.toString()
            )
        })

        //handle it all on front-end side
        //save it
        try{
            await Transaction.insert(allItem)
        }
        catch(e){
            console.log(e)
            res.status(500).send("พบบางอย่างผิดพลาดที่ระบบข้อมูล", e)
        }
        finally{
            await Db.saveDatabase();
        }

        res.status(200).send("Created transaction successfully")
    })
}