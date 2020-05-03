const express      = require('express'),
      app          = express(),
      bodyParser   = require('body-parser'),
      PORT         = process.env.PORT || 5000 
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
    mySqlConnection.query(
        `select flights.*, airlines.a_name from flights, airlines where flights.a_id = airlines.a_id`,
        (err,rows) => {
            if(err)
                res.status(500).send(err)
            else
                res.render("flights", {flights: rows})
        }
    )
})

app.post("/flights", (req,res)=> {
    mySqlConnection.query(
        `insert into flights(a_id, origin, destination, f_status ,f_time) values(
            '${req.body.airline}', '${req.body.origin}', '${req.body.destination}',
            '${req.body.status}', '${req.body.date}'
        )`,
        (err) => {
            if(err)
                res.status(500).send(err)
            else
            {
                res.redirect("/flights")
            }
        }
    )
})

app.get("/flights/new", (req,res) => {
    mySqlConnection.query(
        `select a_id, a_name from airlines`,
        (err, rows) => {
            if(err)
                res.status(500).send(err)
            else
            {
                res.render("add_flight", {airlines: rows})
            }
        }
    )
})

app.put("/flights/:f_id", (req,res)=>{
    mySqlConnection.query(
        `update flights set
            a_id = '${req.body.airline}',
            origin = '${req.body.origin}',
            destination = '${req,body.destination}',
            f_status = '${req.body.status}',
            f_time = '${req.body.date}'
            where f_id = '${req.params.f_id}'
        `,
        (err) => {
            if(err)
                res.status(500).send(err)
            else
            {
                res.redirect("/flights")
            }
        }
    )
})

app.get("/crew", (req,res) => {
    mySqlConnection.query(
        `select employees.e_name, airlines.a_name, flights.origin, flights.destination, flights.f_time from employees, airlines, crew, flights where employees.e_id=crew.e_id and flights.f_id = crew.f_id and flights.a_id = airlines.a_id`,
        (err,rows) => {
            if(err)
                res.status(500).send(err)
            else{
                res.render("crew", {crew: rows})
            }
        }
    )
})

app.post("/crew", (req,res)=> {
    mySqlConnection.query(
        `insert into crew (f_id, e_id) values ('${req.body.flight}', '${req.body.employee}')`,
        (err,rows)=> {
            if(err)
                res.status(500).send(err)
            else
                res.redirect("/crew")
        }
    )
})

app.get("/crew/new", (req,res) => {
    mySqlConnection.query(
        `select employees.e_id, employees.e_name from employees, airlineEmployees where employees.e_id = airlineEmployees.e_id`,
        (e_err,e_rows) => {
            if (e_err)
                res.status(500).send(e_err)
            else{
                mySqlConnection.query(
                    `select flights.f_id, flights.origin, flights.destination, airlines.a_name from flights, airlines where flights.a_id = airlines.a_id`,
                    (f_err, f_rows) => {
                        if(f_err)
                            res.status(500).send(f_err)
                        else{
                            res.render("add_crew", {flights: f_rows, employees: e_rows})
                        }
                    }
                )
            }
        }
    )
})

app.listen(PORT, () => {
    console.log("Serving app on port", PORT);
})