const passport = require('passport')

module.exports = app => {
    app.post('/api/login',passport.authenticate('local-signup'),
    (req,res) => {
        res.send("hello auth")
    })
}