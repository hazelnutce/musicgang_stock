const express = require('express')

const app = express()

require('./routes/testing_route')(app);

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
    console.log("server're running at PORT 5000 without error :)")
})