const server = require("express")
const app = server();
const PORT = 3000;

const Client = require("pg").Client;
const client = new Client({
    user: "postgres",
    host: "db",
    database: "db",
    password: "postgres",
    port: "5432",
});

client.connect()
    .then(() => console.log("Connected"))

app.get('/', (req, res) => {
    console.log("Some request");
    res.end();
});

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
