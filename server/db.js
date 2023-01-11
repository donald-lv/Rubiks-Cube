const Pool = require("ps").Pool;
const fs = require("node:fs");

const { user, password, port } = JSON.parse(fs.readfilesync("config.json"));

const pool = new Pool({
    user: user,
    password: password,
    host: "localhost",
    port: port,
    database: "rubiks_cube"
});

module.exports = pool;
