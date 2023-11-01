const constants = require("./constants.js");

const fs = require("fs");
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

function getK6Json(file_path) {
  const file_content = fs.readFileSync(file_path, "utf-8");
  const result = [];

  file_content.split("\n").forEach((line) => {
    if (line.length > 0) {
      result.push(JSON.parse(line));
    }
  });

  return result;
}

async function getPerfomaceEvaluation(file_path) {
  // start compose file
  runBackend(file_path);
  // await
  await sleep(20 * 1000);
  await runTests();
  // end containers execution
  await exitContainers(file_path);

  return getK6Json(constants.RESULT_FILE);
}

async function getAllEvaluations(dir_path) {
  const composeFiles = fs.readdirSync(dir_path);
  const regex = new RegExp("^compose_[0-9]+.yaml$");
  const results = {};

  for (const file of composeFiles) {
    // check valid files
    if (regex.test(file) === false) continue;

    console.log(`EVALUATING ${file} ...`);

    const filename = `${dir_path}/${file}`;
    const result = await getPerfomaceEvaluation(filename);
    results[file] = result;
  }

  return results;
}

if (typeof module !== "undefined") {
  module.exports = {
    getAllEvaluations,
    getPerfomaceEvaluation,
  };
}
