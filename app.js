const express      = require('express'),
      app          = express(),
      bodyParser   = require('body-parser')
      PORT         = 5000

app.use(bodyParser.urlencoded({extended: true}))
app.set("view engine","ejs")
app.use(express.static("public"))

app.listen(PORT, () => {
    console.log("Serving app on port", PORT);
})