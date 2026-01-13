const express = require("express");
const { requireAuth } = require("../middleware/auth.middleware");
const { requireStudent } = require("../middleware/role.middleware");
const { submitGrade, getGradesForDeliverable } = require("../controllers/grades.controller");

const router = express.Router();

router.use(requireAuth);

// Student jurat
router.post("/deliverables/:deliverableId/grade", requireStudent, submitGrade);

// Teacher sau owner 
router.get("/deliverables/:deliverableId/grades", getGradesForDeliverable);

module.exports = { router };
