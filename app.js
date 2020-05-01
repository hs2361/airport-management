const express      = require('express'),
      app          = express(),
      bodyParser   = require('body-parser'),
      PORT         = 5000 || process.env.PORT
      mySqlConnection = require("./db/db")

app.use(bodyParser.urlencoded({extended: true}))
app.set("view engine","ejs")
app.use(express.static(__dirname + '/public/'));

app.get("/", (req,res) => {
    res.render("landing_page")
})

app.get("/employees", (req,res) => {
    mySqlConnection.query(
        "select *from employees order by doj",
        (err, rows) => {
            if(err)
                res.status(500).send(err)
            else{
                console.log(rows);
                res.render("employees")
            }
        }
    )
})

app.post("/employees", (req,res) => {
    const name = req.body.name
    const type = req.body["employee-type"]

    if (type === 'airline')
    {
        const airlineDept = req.body["airline-department"]
        const airline = req.body["airline-name"]

        mySqlConnection.query(
            `insert into employees(e_name, d_id) values('${name}', ${airlineDept})`,
            (err,result) => {
                if(err)
                    res.status(500).send(err)
                else
                {
                    mySqlConnection.query(
                        `insert into airlineEmployees values(${result.insertId}, ${airline})`,
                        (err2) => {
                            if(err2)
                                res.status(500).send(err2)
                            else
                                res.redirect("/employees")
                        }
                    )
                }
            }
        )
    }

    else
    {
        const department = req.body.department
        mySqlConnection.query(
            `insert into employees(e_name, d_id) values('${name}', ${department})`,
            (err) => {
                if(err)
                    res.status(500).send(err)
                else
                {
                    res.redirect("/employees")
                }
            }
        )
    }
})

app.get("/employees/new", (req,res) => {
    res.render("add_employee")
})

app.delete("/employees/:e_id", (req,res) => {
    mySqlConnection.query(
        `delete from employees where e_id = ${req.params.e_id}`,
        (err) => {
            if(err)
                res.status(500).send(err)
            else
                res.redirect("/employees")
        }
    )
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