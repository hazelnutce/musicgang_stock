const express = require('express')
const mongoose = require('mongoose')
const passport = require('passport')
const cookieSession = require('cookie-session')
const bodyParser = require('body-parser')
const lokijs = require('lokijs')
const morgan = require('morgan')
var cors = require('cors')

const keys = require('./config/key')

//mlab database
require('./models/User')
require('./models/Stock')
require('./models/Category')
require('./services/passport')

var db = new lokijs('./database.json');

var coreApp = db.loadDatabase({}, function(err) {
    if (err) {
      console.log("error : " + err);
      return;
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

      var Transaction = db.getCollection('transaction')
      if(!Transaction){
        Transaction = db.addCollection('transaction')
      }

      var MusicRoomTransaction = db.getCollection('musicroomTransaction')
      if(!MusicRoomTransaction){
        MusicRoomTransaction = db.addCollection('musicroomTransaction')
      }

      var CostTransaction = db.getCollection('costTransaction')
      if(!CostTransaction){
        CostTransaction = db.addCollection('costTransaction')
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
        app.use(morgan('tiny'))

        require('./routes/testingRoute')(app)
        require('./routes/authRoute')(app)
        require('./routes/stockRoute')(app, db, Stock, Item, Category)
        require('./routes/categoryRoute')(app, db, Category, Item)
        require('./routes/itemRoute')(app, db, Item, Category, Transaction)
        require('./routes/transactionRoute')(app, db, Transaction, Stock, Item)
        require('./routes/musicroomRoute')(app, db, MusicRoomTransaction)
        require('./routes/costRoute')(app, db, CostTransaction)
        require('./routes/summaryTransactionRoute')(app, db, Transaction, CostTransaction, MusicRoomTransaction)

        if(!(process.env.NODE_ENV && process.env.NODE_ENV.trim() === 'development')){
            console.log("calling react component from react")
            //express will serve up production asset
            app.use(express.static('client/build'));
            //express will serve up index.html file if it can't recognize route
            const path = require('path');
            app.use('/',(req,res) => {
              console.log("call react from build")
              res.sendFile(path.resolve(__dirname,'client','build','index.html'));
            })

            app.get('/production',(req,res) => {
                console.log("/production testing")
                res.send("Hello client path")
            })
            
            app.get('*',(req,res) => {
              console.log("call react from build")
              res.sendFile(path.resolve(__dirname,'client','build','index.html'));
            })
        }

        const PORT = process.env.PORT || 5000
        app.listen(PORT, () => {
            console.log("server're running at PORT 5000 without error :)")
        })

        return app
    }
});

module.exports = coreApp
