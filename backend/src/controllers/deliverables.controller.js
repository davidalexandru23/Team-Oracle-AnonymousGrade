const { prisma } = require("../prisma/client");
const { HttpError } = require("../utils/httpError");

async function createDeliverable(req, res, next) {
  try {
    const projectId = req.params.projectId;
    const { title, description, deadline, demoUrl } = req.body;

    const project = await prisma.project.findUnique({ where: { id: projectId } });
    if (!project) throw new HttpError(404, "Proiect inexistent.");

    if (req.user.role !== "TEACHER" && project.ownerId !== req.user.id) {
      throw new HttpError(403, "Doar owner-ul poate adauga livrabile.");
    }

    if (!title || typeof title !== "string") throw new HttpError(400, "Titlu livrabil obligatoriu.");
    if (!description || typeof description !== "string") throw new HttpError(400, "Descriere livrabil obligatorie.");
    if (!deadline) throw new HttpError(400, "Deadline obligatoriu.");

    const deadlineDate = new Date(deadline);
    if (Number.isNaN(deadlineDate.getTime())) {
      throw new HttpError(400, "Deadline invalid. Foloseste format ISO (ex: 2026-01-31T12:00:00Z).");
    }

    const deliverable = await prisma.deliverable.create({
      data: {
        projectId,
        title,
        description,
        deadline: deadlineDate,
        demoUrl: demoUrl || null
      }
    });

    return res.status(201).json({ deliverable });
  } catch (err) {
    next(err);
  }
}

async function listDeliverables(req, res, next) {
  try {
    const projectId = req.params.projectId;

    const project = await prisma.project.findUnique({ where: { id: projectId } });
    if (!project) throw new HttpError(404, "Proiect inexistent.");

    if (req.user.role !== "TEACHER" && project.ownerId !== req.user.id) {
      throw new HttpError(403, "Acces interzis la livrabilele acestui proiect.");
    }

    const deliverables = await prisma.deliverable.findMany({
      where: { projectId },
      orderBy: { createdAt: "desc" }
    });

    return res.json({ deliverables });
  } catch (err) {
    next(err);
  }
}

async function updateDemoUrl(req, res, next) {
  try {
    const deliverableId = req.params.id;
    const { demoUrl } = req.body;

    const deliverable = await prisma.deliverable.findUnique({
      where: { id: deliverableId },
      include: { project: true }
    });

    if (!deliverable) throw new HttpError(404, "Livrabil inexistent.");

    if (req.user.role !== "TEACHER" && deliverable.project.ownerId !== req.user.id) {
      throw new HttpError(403, "Doar owner-ul poate modifica demoUrl.");
    }

    const updated = await prisma.deliverable.update({
      where: { id: deliverableId },
      data: { demoUrl: demoUrl || null }
    });

    return res.json({ deliverable: updated });
  } catch (err) {
    next(err);
  }
}

module.exports = { createDeliverable, listDeliverables, updateDemoUrl };
