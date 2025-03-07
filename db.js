const mysql = require("mysql");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "nodemysql",
});

db.connect((err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("Database connected");
  }
});

module.exports = db;
