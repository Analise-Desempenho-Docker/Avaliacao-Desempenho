const constants = require("./constants.js");

const fs = require("fs");
const util = require("node:util");

const exec = util.promisify(require("node:child_process").exec);
const sleep = util.promisify(setTimeout);

async function runBackend(address, composeInfo) {
  console.log("RUNNING CONTAINER");
  console.log(composeInfo);

  const result = await fetch(address, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({composeInfo})
  });
}

async function dropBackend(address) {
  console.log('DROPING CONTAINER')
  const result = await fetch(`${address}/down`, {method: 'POST'});
  return result;
}

async function runTests() {
  console.log("RUNNING TESTS");
  const { stdout, stderr } = await exec(
    "docker compose -f ./compose_files/k6-composer.yaml up"
  );
}

async function exitContainers(address) {
  const command = 'docker compose -f ./compose_files/k6-composer.yaml down';
  const result = await Promise.all([dropBackend(address), exec(command)]);

  return result;
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

async function getPerfomaceEvaluation(address, composeInfo) {
  // start compose file
  runBackend(address, composeInfo);
  // await
  await sleep(20 * 1000);
  await runTests();
  // end containers execution
  await exitContainers(address);

  await sleep(5 * 1000);

  return getK6Json(constants.RESULT_FILE);
}

async function getAllEvaluations(address, dir_path) {
  const composeFiles = fs.readdirSync(dir_path);
  const regex = new RegExp("^compose_[0-9]+.yaml$");
  const results = {};

  for (const file of composeFiles) {
    // check valid files
    if (regex.test(file) === false) continue;

    console.log(`EVALUATING ${file} ...`);

    const filename = `${dir_path}/${file}`;
    const composeInfo = fs.readFileSync(filename, {encoding: 'utf-8', flag: 'r'});
    const result = await getPerfomaceEvaluation(address, composeInfo);
    results[file] = result;
  }

  return results;
}

if (typeof module !== "undefined") {
  module.exports = {
    getAllEvaluations,
    getPerfomaceEvaluation,
    runBackend,
  };
}
