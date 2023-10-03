const { Movies } = require("./models");

// const Client = require("pg").Client;
// const client = new Client({
//   user: process.env.DB_USER,
//   host: "postgres-db",
//   database: process.env.DB_NAME,
//   password: process.env.DB_PASSWORD,
//   port: process.env.DB_PORT,
// });

const getAll = async (request, response) => {
  const result = await Movies.findAll();

  response.json(result);
};

const getById = async (request, response) => {
  const { id } = request.params;

  try {
    const result = await Movies.findOne({ where: { id } });
    response.json(result);
  } catch (err) {
    response.status(500).json(err);
  }
};

const create = async (request, response) => {
  const { name, storyline, rating } = request.body;

  try {
    const result = await Movies.create({ name, storyline, rating });
    response.json(result);
  } catch (err) {
    response.status(500).json(err);
  }
};

const deleteById = async (request, response) => {
  const { id } = request.params;

  try {
    const result = Movies.destroy({ where: { id } });
    response.json(result);
  } catch (err) {
    response.status(500).json(err);
  }
};

module.exports = {
  getAll,
  getById,
  create,
  deleteById,
};
