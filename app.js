const express      = require('express'),
      app          = express(),
      bodyParser   = require('body-parser'),
      PORT         = process.env.PORT || 5000 
      mySqlConnection = require("./db/db")

app.use(bodyParser.urlencoded({extended: true}))
app.set("view engine","ejs")
app.use(express.static(__dirname + '/public/'));

const airportDepts = [], airlineDepts = []
var airlines = [] ,airlineEmpl = [], airportEmpl = []

mySqlConnection.query(
    "select *from departments",
    (err,depts) => {
        if(err)
            console.log(err);
        else
        {
            depts.forEach(dept => {
                if(dept.airport)
                    airportDepts.push(dept)
                else
                    airlineDepts.push(dept)
            });
        }
    }
)

mySqlConnection.query(
    "select *from airlines",
    (err,result) => {
        if(err)
            console.log(err);
        else
            airlines = result
    }
)

mySqlConnection.query(
    "select airlines.a_name, employees.e_name, departments.d_name, airlineEmployees.* from airlines, employees ,airlineEmployees, departments where airlines.a_id = airlineEmployees.a_id and employees.d_id = departments.d_id and employees.e_id = airlineEmployees.e_id",
    (err,employees) => {
        if(err)
            console.log(err);
        else
        {
            airlineEmpl = employees
            mySqlConnection.query(
            "select departments.d_name as d_name, employees.* from employees, departments where employees.d_id = departments.d_id",
            (err2, empl) => {
                if(err2)
                    console.log(err2);
                else
                {   
                    airlineEmplIds = airlineEmpl.map(empl => empl.e_id)
                    airportEmpl = empl.filter(e => !airlineEmplIds.includes(e.e_id))
                }
            })
        }
    }
)

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
                res.render("employees", {airlineEmployees: airlineEmpl, airportEmployees: airportEmpl, airlineDepts: airlineDepts, airportDepts: airportDepts})
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
    res.render("add_employee", {airlineDepts: airlineDepts, airportDepts: airportDepts, airlines: airlines})
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
    res.render("crew")
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
    res.render("add_crew")
})

app.listen(PORT, () => {
    console.log("Serving app on port", PORT);
})