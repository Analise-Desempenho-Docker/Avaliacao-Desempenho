const address = 'http://165.227.114.218:8000';

const constants = require("./constants.js");
const evaluator = require("./evaluator.js");

const fs = require("fs");
const YAML = require("yaml");
const doc = new YAML.Document();

const configs = JSON.parse(fs.readFileSync(constants.PARAMS_FILE));

let id = 1;

for (const { backend, database } of configs) {
  const composeObj = {
    services: {
      backend: generateBackend(backend.image, backend.cpus, backend.mem_limit),
      database: generateDatabase(
        database.image,
        database.cpus,
        database.mem_limit
      ),
    },
  };

  composeObj.services.backend.environment.NODE_ENV = `${database.image}Env`;

  doc.contents = composeObj;
  fs.writeFileSync(
    `${constants.COMPOSE_DIR}/compose_${id}.yaml`,
    doc.toString()
  );

  id++;
}

function generateBackend(image, cpus, ram) {
  const {DB_NAME, DB_PASSWORD, DB_PORT, DB_HOST} = process.env;

  return {
    image: "node:21-alpine3.17",
    mem_limit: ram,
    cpus,
    volumes: ["./application:/application"],
    environment: {
      DB_NAME: DB_NAME,
      DB_PASSWORD: DB_PASSWORD,
      DB_PORT: DB_PORT,
      DB_HOST: DB_HOST,
      NODE_ENV: "postgresEnv",
    },
    ports: ["3000:3000"],
    command: '/bin/sh -c "cd /application && npm i && node app"',
  };
}

function generateDatabase(database, cpus, ram) {
  const {DB_NAME, DB_PASSWORD} = process.env;
  
  const result = {
    postgres: {
      image: "postgres:16-alpine3.18",
      mem_limit: ram,
      cpus,
      environment: {
        POSTGRES_DB: DB_NAME,
        POSTGRES_PASSWORD: DB_PASSWORD,
      },
    },
    mysql: {
      image: "mysql:5.7",
      mem_limit: ram,
      cpus,
      environment: {
        MYSQL_DATABASE: DB_NAME,
        MYSQL_ROOT_PASSWORD: DB_PASSWORD,
      },
    },
  };

  return result[database] || {};
}

//evaluator.runBackend(address, fs.readFileSync('./compose_files/compose_1.yaml', {encoding: 'utf-8', flag: 'r'}));

evaluator.getPerfomaceEvaluation(address, fs.readFileSync('./compose_files/compose_1.yaml', {encoding: 'utf-8', flag: 'r'}))
  .then(value => {
    fs.writeFileSync(
      constants.EVALUATION_FILE,
      JSON.stringify(value, null, 2)
    )
  })

// evaluator
//   .getAllEvaluations(constants.COMPOSE_DIR)
//   .then((results) =>
//     fs.writeFileSync(
//       constants.EVALUATION_FILE,
//       JSON.stringify(results, null, 2)
//     )
//   );
