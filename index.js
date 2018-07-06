const express = require('express')
const mongoose = require('mongoose')
const keys = require('./config/key')

const app = express()

mongoose.connect(keys.mongoUrl);

require('./routes/testing_route')(app);

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
    console.log("server're running at PORT 5000 without error :)")
})