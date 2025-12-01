import { buildApp } from "./app.ts";
import { env } from "./env.ts";

const app = buildApp();

app.listen({ port: env.PORT }).then(() => {
  console.log(`
    Server is running on http://localhost:${env.PORT}
    Documentation on http://localhost:${env.PORT}/docs 
  `);
});
