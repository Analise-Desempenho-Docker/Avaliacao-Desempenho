const constants = {};

constants.COMPOSE_DIR = "./compose_files";

constants.K6_FILE = `${constants.COMPOSE_DIR}/k6-composer.yaml`;
constants.PARAMS_FILE = "./paramConfig.json";
constants.RESULT_FILE = "./loadTests/result.json";
constants.EVALUATION_FILE = "out.json";

if (typeof module !== "undefined") {
  module.exports = constants;
}
