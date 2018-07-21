const passport = require('passport')

module.exports = app => {
    app.post('/api/signup', passport.authenticate('local-signup'),
    (req,res) => {
        res.status(200).send("create account success")
    })

    app.post('/api/login', passport.authenticate('local', { failureRedirect: '/api/autherror' }), 
    (req,res) => {
        res.status(302).redirect('/')
    })

    app.get('/api/logout',(req,res) => {
        req.logout()
        res.redirect('/');
    })

    app.get('/api/currentuser', (req,res) => {
        res.send(req.user)
    })

    app.get('/api/autherror',(req,res,next) => {
        res.status(401)
        res.json({message: 'Invalid username or password'})
    })
}