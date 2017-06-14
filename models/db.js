var mysql = require('mysql');

var connect = mysql.createConnection({
    host: "localhost",
    port: 80,
    user: "root",
    password: "",
    database: "sanctuary"
});
//var connect = "http://localhost:80/sanctuary"

module.exports = connect;