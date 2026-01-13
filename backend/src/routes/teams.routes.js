const express = require("express");
const { requireAuth } = require("../middleware/auth.middleware");
const { requireStudent } = require("../middleware/role.middleware");
const {
    listTeams,
    getTeam,
    createTeam,
    addMember,
    removeMember,
    addProject
} = require("../controllers/teams.controller");

const router = express.Router();

router.use(requireAuth);

// All these routes are accessible by STUDENT (as per user request "Acces: STUDENT")
// "POST /teams/:teamId/projects Adaugă proiect în echipă Owner only" 
// Owner implies the user is creator of team, who must be a student (or teacher?).
// User requirement table says "Acces STUDENT" for GET /teams. 
// "POST /teams" -> STUDENT.
// So I will apply requireStudent? Or just requireAuth and let service handle ownership?
// `requireAuth` is enough base, service checks ownership. `requireStudent` is for role.
// User spec: "Acces STUDENT". So I should probably check role STUDENT.

router.get("/teams", requireStudent, listTeams);
router.get("/teams/:teamId", requireStudent, getTeam);
router.post("/teams", requireStudent, createTeam);
router.post("/teams/:teamId/projects", requireStudent, addProject);
router.post("/teams/:teamId/members", requireStudent, addMember);
router.delete("/teams/:teamId/members/:memberId", requireStudent, removeMember);

module.exports = { router };
