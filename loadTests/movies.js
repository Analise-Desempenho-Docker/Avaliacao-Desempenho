import faker from "https://cdnjs.cloudflare.com/ajax/libs/Faker/3.1.0/faker.min.js";

const generateMovie = () => {
  return {
    name: faker.name.firstName(),
    storyline:
      "amsdfma rajralsfasldfma ldf dfaskfd ld asdfansdfa sdfna sfalskma",
    rating: 3.8,
  };
};

export default generateMovie;
