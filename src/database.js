const mysql = require("mysql");
const { promisify } = require("util");

const { database } = require("./keys");

const pool = mysql.createPool(database);

pool.getConnection((err, connection) => {
  if (err) {
    if (err.code === "PROTOCOL_CONNECTION_LOST") {
      console.error("DATABASE CONNECTION WAS CLOSED");
    }
    if (err.cod === "ERR_CON_COUNT_ERROR") {
      console.error("DATABASE HAS TOO MANY CONNECTIONS");
    }
    if (err.cod === "ECONNREFUSED") {
      console.error("DATABASE CONNECTION WAS REFUSED");
    }
  }
  if (connection) connection.release();
  console.log("DB IS CONNECTED");
  return;
});

//promisify pool query, transforming callbacks
pool.query = promisify(pool.query);

module.exports = pool;
