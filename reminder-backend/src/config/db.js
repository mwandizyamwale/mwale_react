const sql = require('mssql')
require('dotenv').config()

const db = mysql.createconnection({
  host: process.env.MYSQLHOST,
  user: process.env.MYSQLUSER,
  password: process.env.MYSQLPASSWORD,
  database: process.env.MYSQLDATABASE,
  port: process.env.MYSQLPORT
});
 
db.connect((err) => {
  if (err) {
    
    console.error('Database failed to connect', err);
  } else {
    console.log('Database connected');
  }
});

module.exports = db;


