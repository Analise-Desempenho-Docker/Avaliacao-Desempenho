import http from "k6/http";
import { sleep } from "k6";
import faker from "https://cdnjs.cloudflare.com/ajax/libs/Faker/3.1.0/faker.min.js";

export const options = {
  vus: 10,
  duration: "10s",
};

export default function () {
  http.get("http://172.17.0.1:3000/movies");

  const payload = JSON.stringify({
    name: faker.name.firstName(),
    storyline:
      "amsdfma rajralsfasldfma ldf dfaskfd ld asdfansdfa sdfna sfalskma",
    rating: 3.8,
  });

  const params = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  http.post("http://172.17.0.1:3000/movies", payload, params);
  sleep(1);
}
