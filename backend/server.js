const { env } = require("./src/config/env");
const { createApp } = require("./src/app");

const app = createApp();

app.listen(env.port, () => {
  console.log(`Server pornit pe port ${env.port}`);
});
