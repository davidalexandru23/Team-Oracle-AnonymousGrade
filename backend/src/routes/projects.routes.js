const express = require("express");
const { requireAuth } = require("../middleware/auth.middleware");
const { requireStudent } = require("../middleware/role.middleware");
const { createProject, listProjects, getProjectById } = require("../controllers/projects.controller");

const router = express.Router();

router.use(requireAuth);

router.post("/", requireStudent, createProject);
router.get("/", listProjects);
router.get("/:id", getProjectById);

module.exports = { router };
