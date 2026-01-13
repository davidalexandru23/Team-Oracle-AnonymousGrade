const express = require("express");
const { requireAuth } = require("../middleware/auth.middleware");
const { requireTeacher, requireStudent } = require("../middleware/role.middleware");
const { assignJuryToDeliverable, myAssignments } = require("../controllers/jury.controller");

const router = express.Router();

router.use(requireAuth);

router.post("/deliverables/:deliverableId/assign-jury", requireTeacher, assignJuryToDeliverable);
router.get("/my-assignments", requireStudent, myAssignments);

module.exports = { router };
