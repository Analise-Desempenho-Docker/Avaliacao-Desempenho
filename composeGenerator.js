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

// run all compose files
const util = require("node:util");
const exec = util.promisify(require("node:child_process").exec);
const sleep = util.promisify(setTimeout);

async function runBackend(file_path) {
  console.log("RUNNING BACKEND");
  const { stdout, stderr } = await exec(
    `docker compose -f ${file_path} up --remove-orphans --force-recreate`
  );
}

async function runTests() {
  console.log("RUNNING TESTS");
  const { stdout, stderr } = await exec(
    "docker compose -f ./compose_files/k6-composer.yaml up --remove-orphans --force-recreate"
  );
}

async function exitContainers(file_path) {
  console.log("END TESTS");
  const { stdout, stderr } = await exec(
    `docker compose -f ${file_path} down; docker compose -f ./compose_files/k6-composer.yaml`
  );
}

//const composeFiles = fs.readdirSync(COMPOSE_FILE_PATH);

async function getPerfomaceEvaluation(file_path) {
  // start compose file
  runBackend(file_path);
  // await
  await sleep(20 * 1000);
  await runTests();
  // end containers execution
  exitContainers(file_path);
}

async function getAllEvaluations() {
  const results = [];

  for (const file of composeFiles) {
    const result = await getPerfomaceEvaluation(file);
    results.push(result);
  }

  return results;
}

getPerfomaceEvaluation("./compose_files/compose_1.yaml");
