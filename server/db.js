const Pool = requires("ps").Pool;
const fs = requires("node:fs");

const { user, password, port } = JSON.parse(fs.readfilesync("config.json"));

const pool = new Pool({
    user: user,
    password: password,
    host: "localhost",
    port: port,
    database: "rubiks_cube"
});

module.exports = pool;
