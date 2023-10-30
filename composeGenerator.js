const fs = require("fs");
const YAML = require("yaml");
const doc = new YAML.Document();

const PARAMS_FILE = "./paramConfig.json";
const COMPOSE_PATH = "./compose_files";

const configs = JSON.parse(fs.readFileSync(PARAMS_FILE));

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
  fs.writeFileSync(`${COMPOSE_PATH}/compose_${id}.yaml`, doc.toString());

  id++;
}

function generateBackend(image, cpus, ram) {
  return {
    image: "node:21-alpine3.17",
    mem_limit: ram,
    cpus,
    volumes: ["../backend:/backend"],
    environment: {
      DB_NAME: "${DB_NAME}",
      DB_PASSWORD: "${DB_PASSWORD}",
      DB_PORT: "${DB_PORT}",
      DB_HOST: "${DB_HOST}",
      NODE_ENV: "postgresEnv",
    },
    ports: ["3000:3000"],
    depends_on: ["database"],
    command: '/bin/sh -c "cd /backend && npm i && node app"',
  };
}

function generateDatabase(database, cpus, ram) {
  const result = {
    postgres: {
      image: "postgres:16-alpine3.18",
      mem_limit: ram,
      cpus,
      environment: {
        POSTGRES_DB: "${DB_NAME}",
        POSTGRES_PASSWORD: "${DB_PASSWORD}",
      },
    },
    mysql: {
      image: "mysql:5.7",
      mem_limit: ram,
      cpus,
      environment: {
        MYSQL_DATABASE: "${DB_NAME}",
        MYSQL_ROOT_PASSWORD: "${DB_PASSWORD}",
      },
    },
  };

  return result[database] || {};
}
