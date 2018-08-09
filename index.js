const express = require('express')
const mongoose = require('mongoose')
const passport = require('passport')
const cookieSession = require('cookie-session')
const bodyParser = require('body-parser');

const keys = require('./config/key')

require('./models/User')
require('./models/Stock')
require('./services/passport')

mongoose.connect(keys.mongoUrl,{ useNewUrlParser: true });

const app = express()

app.use(bodyParser.json());

app.use(cookieSession({
    maxAge: 30*24*60*60*1000,
    keys: [keys.cookieKey]
}))

app.use(passport.initialize())
app.use(passport.session())

require('./routes/testingRoute')(app)
require('./routes/authRoute')(app)
require('./routes/stockRoute')(app)

if(process.env.NODE_ENV === 'production' ){
    //express will serve up production asset
    app.use(express.static('client/build'));
    //express will serve up index.html file if it can't recognize route
    const path = require('path');
    app.get('/production/testing',(req,res) => {
        res.send("Hello client path")
    })
    app.get('*',(req,res) => {
      res.sendFile(path.resolve(__dirname,'client','build','index.html'));
    })
}

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
    console.log("server're running at PORT 5000 without error :)")
})