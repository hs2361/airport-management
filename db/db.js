const mysql = require('mysql');

var mySqlConnection = mysql.createPool({
    host: "us-cdbr-east-06.cleardb.net",
    user: "bca25c9f68c41d",
    password: "6cf116a8",
    database: "heroku_b7b80bd4f1b1e81",
});

module.exports = mySqlConnection;