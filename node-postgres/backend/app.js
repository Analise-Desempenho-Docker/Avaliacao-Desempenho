const server = require("express");
const bodyParser = require("body-parser");
const db = require("./queries.js");
const app = server();
const PORT = 3000;

app.use(bodyParser.json());
app.use(
    bodyParser.urlencoded({
        extended: true,
    })
);

app.get('/', (request, response) => {
    response.json({
        info: "Basic movies API", 
        paths: ["/movies", "/movies/:id"]
    })
})

app.get('/movies', db.getAll);
app.get('/movies/:id', db.getById);

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
