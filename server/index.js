
const express = require("express");
const app = express();

const pool = require("./db");

const port = 3000;

app.use(express.json);

// ROUTES
app.get('/', (req, res) => {
    res.send("accepted get");
    console.log("get gotten");
});



app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
