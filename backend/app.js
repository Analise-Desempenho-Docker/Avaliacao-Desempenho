const server = require("express");
const bodyParser = require("body-parser");
const app = server();
const PORT = 3000;

const db = require("./queries.js");
const { sequelize } = require("./models");

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

app.get("/movies", db.getAll);
app.get("/movies/:id", db.getById);
app.delete("/movies/:id", db.deleteById);
app.post("/movies", db.create);

app.listen(PORT, async () => {
  let isConnected = false;
  const delay = 5000;
  console.log(`Listening on port ${PORT}`);

  while (!isConnected) {
    try {
      await sequelize.sync({ force: true });
      isConnected = true;
      console.log("Sequelize synced");
    } catch (err) {
      console.log("Error trying to sync\nTrying to connect ...");
      await new Promise((r) => setTimeout(r, delay));
    }
  }
});
