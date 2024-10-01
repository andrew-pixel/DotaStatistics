const postgres = require("pg").Pool;

const pool = postgres({
    user: "postgres",
    password: "postgres",
    host: "localhost",
    port: 5432,
    database: "dotaHeroes"
})

module.exports = pool;