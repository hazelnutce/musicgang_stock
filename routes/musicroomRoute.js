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

    app.post('/api/musicroom/edit', requireLogin, async (req,res) => {
        const {_id, day, endTime, 
            formatDiff, formatEndTime, formatPrice, formatRoomsize, 
            formatStartTime, isOverNight, isStudentDiscount, roomSize,
            startTime} = req.body
        var result = Musicroom.findOne({_id})
        if(result){
            try{
                result._id = _id
                result.day = day
                result.endTime = endTime
                result.formatDiff = formatDiff
                result.formatEndTime = formatEndTime
                result.formatPrice = formatPrice
                result.formatRoomsize = formatRoomsize
                result.formatStartTime = formatStartTime
                result.isOverNight = isOverNight
                result.isStudentDiscount = isStudentDiscount
                result.roomSize = roomSize
                result.startTime = startTime
                Musicroom.update(result)
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