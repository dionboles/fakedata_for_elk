import { faker } from "npm:@faker-js/faker";
import { writeFile } from "node:fs";
const projects = Array.from({ length: 1000 }).map(() => ({
  id: faker.number.int().toString(),
  clientId: faker.number.int().toString(),
  description: faker.lorem.paragraph(),
  status: faker.helpers.arrayElement(["In Progress", "No started", "Complete"]),
}));

writeFile("data.json", JSON.stringify(projects, null, 4), (err) => {
  console.log(err);
});
