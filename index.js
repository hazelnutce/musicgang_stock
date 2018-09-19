const express = require('express')
const mongoose = require('mongoose')
const passport = require('passport')
const cookieSession = require('cookie-session')
const bodyParser = require('body-parser')
const lowkie = require('lowkie')
const path = require('path')

const keys = require('./config/key')

//mlab database
require('./models/User')
require('./models/Stock')
require('./models/Category')
require('./services/passport')

mongoose.connect(keys.mongoUrl,{ useNewUrlParser: true });

//in-memory database
lowkie.connect(path.join(__dirname, './database/database.json'))
    .then((db) => {
        console.log('connected local db')
    })
    .catch((e) => {
        console.log('connection error', e)
    })

//listen for connection errors on local database
lowkie.connection.on('connectionError', (e)=>{
    console.log('error connecting to the db',e);
});
  
//listen for connecting status, dbname is the path to the db json file
lowkie.connection.on('connecting', (dbname, options)=>{
    console.log('now trying to connect to db');
});

lowkie.connection.once('connected',(db,option) => {
    console.log('now connected to db');
    
    const Category = require('./models/lokidb/Category')
    const Stock = require('./models/lokidb/Stock')

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
    require('./routes/categoryRoute')(app)

    if(!(process.env.NODE_ENV && process.env.NODE_ENV.trim() === 'development')){
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
})

