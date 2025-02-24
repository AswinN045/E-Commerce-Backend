const pgp = require('pg-promise')();
const config = require('./config/config')

const conn = {
    host: config.database.host,
    port: config.database.port,
    database: config.database.database,
    user: config.database.user,
    password: config.database.password,
    ssl: false
}
const db = pgp(conn);

module.exports = db;