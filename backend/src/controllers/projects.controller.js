const { prisma } = require("../prisma/client");
const { HttpError } = require("../utils/httpError");

async function createProject(req, res, next) {
  try {
    const { title, description } = req.body;

    if (!title || typeof title !== "string") {
      throw new HttpError(400, "Titlul proiectului este obligatoriu.");
    }
    if (!description || typeof description !== "string") {
      throw new HttpError(400, "Descrierea proiectului este obligatorie.");
    }

    const project = await prisma.project.create({
      data: {
        title,
        description,
        ownerId: req.user.id
      }
    });

    return res.status(201).json({ project });
  } catch (err) {
    next(err);
  }
}

async function listProjects(req, res, next) {
  try {
    if (req.user.role === "TEACHER") {
      const projects = await prisma.project.findMany({
        orderBy: { createdAt: "desc" },
        include: { owner: { select: { id: true, name: true, email: true } } }
      });
      return res.json({ projects });
    }

    const projects = await prisma.project.findMany({
      where: { ownerId: req.user.id },
      orderBy: { createdAt: "desc" }
    });

    return res.json({ projects });
  } catch (err) {
    next(err);
  }
}

async function getProjectById(req, res, next) {
  try {
    const projectId = req.params.id;

    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: {
        deliverables: { orderBy: { createdAt: "desc" } }
      }
    });

    if (!project) {
      throw new HttpError(404, "Proiect inexistent.");
    }

    const isTeacher = req.user.role === "TEACHER";
    const isOwner = project.ownerId === req.user.id;

    let isTeamMember = false;
    if (project.teamId) {
      const membership = await prisma.teamMember.findUnique({
        where: {
          teamId_userId: {
            teamId: project.teamId,
            userId: req.user.id
          }
        }
      });
      isTeamMember = !!membership;

      if (!isTeamMember) {
        const team = await prisma.team.findUnique({
          where: { id: project.teamId },
          select: { ownerId: true }
        });
        if (team && team.ownerId === req.user.id) {
          isTeamMember = true;
        }
      }
    }

    if (!isTeacher && !isOwner && !isTeamMember) {
      throw new HttpError(403, "Acces interzis la acest proiect.");
    }

    return res.json({ project });
  } catch (err) {
    next(err);
  }
}

module.exports = { createProject, listProjects, getProjectById };
