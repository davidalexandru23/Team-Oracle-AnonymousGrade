const teamsService = require("../services/teams.service");
const { HttpError } = require("../utils/httpError");

async function listTeams(req, res, next) {
    try {
        const teams = await teamsService.listTeams(req.user.id);
        return res.json({ teams });
    } catch (err) {
        next(err);
    }
}

async function getTeam(req, res, next) {
    try {
        const { teamId } = req.params;
        const team = await teamsService.getTeam(teamId, req.user.id);
        return res.json({ team });
    } catch (err) {
        next(err);
    }
}

async function createTeam(req, res, next) {
    try {
        const { name, description } = req.body;
        if (!name) {
            throw new HttpError(400, "Numele echipei este obligatoriu.");
        }
        const team = await teamsService.createTeam(req.user.id, name, description || "");
        return res.status(201).json({ team });
    } catch (err) {
        next(err);
    }
}


async function getAvailableStudents(req, res, next) {

    try {
        const { teamId } = req.params;
        const students = await teamsService.getAvailableStudents(teamId);
        return res.json({ students });
    } catch (err) {
        next(err);
    }
}

async function addMember(req, res, next) {
    try {
        const { teamId } = req.params;
        const { studentId } = req.body;
        if (!studentId) {
            throw new HttpError(400, "StudentId-ul este obligatoriu.");
        }
        const result = await teamsService.addMember(teamId, req.user.id, studentId);
        return res.status(201).json(result);
    } catch (err) {
        next(err);
    }
}

async function removeMember(req, res, next) {
    try {
        const { teamId, memberId } = req.params;
        const result = await teamsService.removeMember(teamId, req.user.id, memberId);
        return res.json(result);
    } catch (err) {
        next(err);
    }
}

async function addProject(req, res, next) {
    try {
        const { teamId } = req.params;
        const { projectId } = req.body; // Wait, request says body: { title, description } usually creates new project? 
        // BUT User request: "POST /teams/:id/projects Adaugă proiect în echipă Owner only" 
        // And "POST /teams/:id/projects (body: { title, description }): { project: ... }"
        // This implies CREATING a project inside a team? Or attaching existing?
        // "Actualizare Project: teamId String?" -> Project exists. 
        // If body is title/description it sounds like CREATING.
        // If it's attaching, body should be projectId.
        // Let's re-read USER REQUEST carefully.
        // "POST /teams/:teamId/projects Adaugă proiect în echipă Owner only"
        // "POST /teams/:id/projects (body: { title, description })" => This strongly suggests CREATING a new project linked to team.

        // However, my service `addProject` (implemented above) took `projectId` to attach EXISTING.
        // I should support CREATING based on body {title, description}.
        // Or if purely attaching, I'd expect projectId. 
        // The response example: { "project": { "id": "...", "title": "...", "description": "...", "teamId": "..." } }
        // This looks like a returned project object.

        // I will IMPLEMENT creation of project here to match the body {title, description}.
        // I need to import createProject from projects service or use prisma directly.
        // Let's modify the plan slightly: The controller will handle "Create Project within Team".

        // Wait, let's check `projects.service.js` (I can't see it but I can assume).
        // Or I can just write the logic here or call a new service method.
        // Given I already wrote `addProject` in service to ATTACH, I should probably also have `createProjectForTeam`.

        // But let's look at `projects.controller.js` or `projects.routes.js`. 
        // Usually projects are created at `/projects`. 
        // If the user wants `/teams/:id/projects` with title/desc, they want to create it there.

        // Re-evaluating: I will modify `teams.service.js` to support CREATE project for team? 
        // Or just use `prisma.project.create` inside controller? Better in service.
        // I'll stick to the user's specific Body requirements: { title, description }.

        const { title, description } = req.body;
        if (!title) {
            // If title is missing, maybe they meant to attach existing? 
            // But let's assume strict compliance with spec {title, description}.
            throw new HttpError(400, "Titlul este obligatoriu.");
        }

        // I need a service method for this. `teamsService.createProjectForTeam`? 
        // Since I haven't implemented that in `teams.service.js` yet, I should append it or use what I have.
        // The previously implemented `addProject` uses `projectId`. 
        // I should update `teams.service.js` OR implement logic in controller. Service is cleaner.
        // I will update `teams.service.js` with `createTeamProject`.

        // For now, I'll call `teamsService.createTeamProject` and I will update service in next step.
        const project = await teamsService.createTeamProject(teamId, req.user.id, title, description || "");
        return res.status(201).json({ project });

    } catch (err) {
        next(err);
    }
}

module.exports = {
    listTeams,
    getTeam,
    createTeam,
    getAvailableStudents,
    addMember,
    removeMember,
    addProject
};
