const requireLogin = require('../middleware/requireLogin')
const handleString = require('../middleware/handleStringOnRequestBody')
const guid = require('../services/guid')

function checkNameAndYear(d1, d2) {
    return d1.getMonth() === d2.getMonth() &&
        d1.getFullYear() === d2.getFullYear();
}

module.exports = (app, Db, Musicroom) => {
    app.get('/api/musicroom',requireLogin,(req,res) => {
        var result = Musicroom.find({_user: req.user.id.toString()})
        res.send(result)
    })

    app.post('/api/musicroom/add', requireLogin, handleString, async (req,res) => {
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

    app.post('/api/musicroom/get', requireLogin, async(req,res) => {
        var {recordId} = req.body

        var result = Musicroom.find({_user: req.user.id.toString(), _id: recordId.toString()})

        if(result.length == 1){
            res.send(result[0])
        }
        else{
            res.status(500).send("ข้อมูลผิดพลาด กรุณารีเฟรชหน้าหรือลองใหม่อีกครั้ง")
        }
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

    app.post('/api/musicroom/edit', requireLogin, handleString, async (req,res) => {
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

    app.post('/api/musicroom/getTotalRevenue/:month',requireLogin, async (req,res) => {
        const month = req.params.month

        var currentYear = parseInt(month / 12)
        var currentMonth = month % 12

        var currentDateInstance = new Date(currentYear, currentMonth)

        var result = Musicroom.where((obj) => {
            return obj._user == req.user.id.toString() && checkNameAndYear(currentDateInstance, new Date(obj.day));
        })

        var resultTotal = 0

        if(result.length > 0){
            resultTotal = result.reduce(function(prev, cur) {
                return prev + parseFloat(cur.formatPrice);
            }, 0)
        }

        res.send(resultTotal.toString())
    })
}