const express      = require('express'),
      app          = express(),
      bodyParser   = require('body-parser'),
      PORT         = 5000

app.use(bodyParser.urlencoded({extended: true}))
app.set("view engine","ejs")
app.use(express.static(__dirname + '/public/'));

app.get("/", (req,res) => {
    res.status(200).send("Landing page")
})

app.get("/employees", (req,res) => {
    res.render("employees")
})

app.post("/employees", (req,res) => {
    //logic to add to db
    res.redirect("/employees")
})

app.get("/employees/new", (req,res) => {
    res.render("add_employee")
})

app.get("/flights", (req,res) => {
    res.render("flights")
})

app.get("/flights/new", (req,res) => {
    res.render("add_flight")
})

app.listen(PORT, () => {
    console.log("Serving app on port", PORT);
})