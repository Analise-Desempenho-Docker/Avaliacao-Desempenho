const { sequelize } = require("./models");
const server = require("express");
const bodyParser = require("body-parser");
// const db = require("./queries.js");
const app = server();
const PORT = 3000;

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.get("/", (request, response) => {
  response.json({
    info: "Basic movies API",
    paths: ["/movies", "/movies/:id"],
  });
});

// app.get("/movies", db.getAll);
// app.get("/movies/:id", db.getById);
// app.post("/movies", db.create);

app.listen(PORT, async () => {
  console.log(`Listening on port ${PORT}`);

  await sequelize.sync({ force: true });
  console.log("Sequelize synced");
});
