const { env } = require("./config/env");
const { createApp } = require("./app");

const app = createApp();

app.listen(env.port, () => {
  console.log(`Server pornit pe port ${env.port}`);
});
