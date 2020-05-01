const express      = require('express'),
      app          = express(),
      bodyParser   = require('body-parser'),
      PORT         = 5000

app.use(bodyParser.urlencoded({extended: true}))
app.set("view engine","ejs")
app.use(express.static(__dirname + '/public/'));

app.get("/", (req,res) => {
    res.render("landing_page")
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

app.get("/crew", (req,res) => {
    res.render("crew")
})

app.get("/crew/new", (req,res) => {
    res.render("add_crew")
})

app.listen(PORT, () => {
    console.log("Serving app on port", PORT);
})