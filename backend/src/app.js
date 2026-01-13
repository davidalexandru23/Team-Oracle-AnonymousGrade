const express = require("express");
const cors = require("cors");

const { router: authRoutes } = require("./routes/auth.routes");
const { router: projectsRoutes } = require("./routes/projects.routes");
const { router: deliverablesRoutes } = require("./routes/deliverables.routes");
const { router: juryRoutes } = require("./routes/jury.routes");
const { router: gradesRoutes } = require("./routes/grades.routes");

const { errorHandler } = require("./middleware/error.middleware");
const { requestLogger } = require("./middleware/logging.middleware");

function createApp() {
  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use(requestLogger);

  // healthcheck simplu
  app.get("/health", (req, res) => res.json({ ok: true }));

  app.use("/auth", authRoutes);
  app.use("/projects", projectsRoutes);

  // deliverables routes sunt definite cu path-uri complete in router
  app.use("/", deliverablesRoutes);

  app.use("/", juryRoutes);
  app.use("/", gradesRoutes);

  app.use(errorHandler);

  return app;
}

module.exports = { createApp };
