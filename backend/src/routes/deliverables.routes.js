const express = require("express");
const { requireAuth } = require("../middleware/auth.middleware");
const { createDeliverable, listDeliverables, updateDemoUrl } = require("../controllers/deliverables.controller");

const router = express.Router();

router.use(requireAuth);

router.post("/projects/:projectId/deliverables", createDeliverable);
router.get("/projects/:projectId/deliverables", listDeliverables);
router.patch("/deliverables/:id/demo-url", updateDemoUrl);

module.exports = { router };
