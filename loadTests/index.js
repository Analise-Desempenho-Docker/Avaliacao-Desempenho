import http from "k6/http";
import { sleep } from "k6";

import generateMovie from "./movies.js";

const baseUrl = "http://172.17.0.1:3000";

export const options = {
  stages: [
    { duration: "10s", target: 10 },
    { duration: "30s", target: 50 },
    { duration: "20s", target: 0 },
  ],
  tresholds: {
    http_req_duration: ["p(90)<200", "p(95)<300"],
  },
};

export default function () {
  // Consulta
  http.get(`${baseUrl}/movies`);

  const movie = generateMovie();
  const payload = JSON.stringify(movie);

  const params = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  // Criacao
  const resPost = http.post(`${baseUrl}/movies`, payload, params);

  // Remocao
  if (resPost.status == 200) {
    const movieId = JSON.parse(resPost.body).id;
    http.del(`${baseUrl}/movies/${movieId}`);
  }

  sleep(1);
}
