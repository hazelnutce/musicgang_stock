const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const User = mongoose.model('users')

passport.use(new LocalStrategy(
    (username,password,done) => {
        User.findOne({username: username}, (err,user) => {
            if(err) {
                console.log(err)
                return done(err)
            }
            if(!user){
                console.log("User didn't exist")
                return done(null,false)
            }
            bcrypt.compare(password,user.password).then(function(res){
                if(!res){
                    console.log("Password invalid")
                    return done(null, false);
                }
                return done(null,user)
            })
        })
    }
))

passport.use('local-signup',new LocalStrategy(
    async (username,password,done) => {
        const user = await User.findOne({username: username})
        if(user){
            return done(null,false)
        }
        bcrypt.hash(password, 12).then(async function(hashPassword){
            const newUser = new User({
                username: username,
                password: hashPassword
            })
            const willSaveUser = await newUser.save()
            return done(null,willSaveUser)
        })
    }
))

passport.serializeUser((user,done) => {
    done(null,user.id)
})

passport.deserializeUser((id,done) => {
    User.findOne({
        _id: id
    },'-password -salt', (err,user) => {
        done(err,user)
    })
})



