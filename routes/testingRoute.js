
module.exports = (app) => {
    app.get('/api/testing',(req,res) => {
        res.send("hello world");
    })
}