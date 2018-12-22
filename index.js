const express = require('express')
const mongoose = require('mongoose')
const passport = require('passport')
const cookieSession = require('cookie-session')
const bodyParser = require('body-parser')
const lokijs = require('lokijs')
var cors = require('cors')

const keys = require('./config/key')

//mlab database
require('./models/User')
require('./models/Stock')
require('./models/Category')
require('./services/passport')

var db = new lokijs('./database.json');

db.loadDatabase({}, function(err) {
    if (err) {
      console.log("error : " + err);
    }
    else {
      console.log("database loaded.");
      //----------------------- initalize part ------------------------------

      var Stock = db.getCollection('stock');
      if(!Stock){
        Stock = db.addCollection('stock')
      }
      
      var Category = db.getCollection('category');
      if(!Category){
          Category = db.addCollection('category');
      }

      var Item = db.getCollection('item');
      if(!Item){
          Item = db.addCollection('item')
      }

      //----------------------- end of initalize part ------------------------------

      mongoose.connect(keys.mongoUrl,{ useNewUrlParser: true });

        const app = express()

        app.use(bodyParser.json());

        app.use(cookieSession({
            maxAge: 30*24*60*60*1000,
            keys: [keys.cookieKey]
        }))

        app.use(passport.initialize())
        app.use(passport.session())
        app.use(cors({credentials: true, origin:'http://localhost:3000'})) // allows receiving of cookies from front-end

        require('./routes/testingRoute')(app)
        require('./routes/authRoute')(app)
        require('./routes/stockRoute')(app, db, Stock, Item)
        require('./routes/categoryRoute')(app, db, Category)
        require('./routes/itemRoute')(app, db, Item, Category)

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
    }
});




