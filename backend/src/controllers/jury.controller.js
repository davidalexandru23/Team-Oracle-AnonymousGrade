const { env } = require("../config/env");
const { HttpError } = require("../utils/httpError");
const { assignJury } = require("../services/jury.service");
const { prisma } = require("../prisma/client");

async function assignJuryToDeliverable(req, res, next) {
  try {
    const deliverableId = req.params.deliverableId;

    // expiresAt = acum + X ore 
    const expiresAt = new Date(Date.now() + env.assignmentExpiresHours * 60 * 60 * 1000);

    const result = await assignJury({
      deliverableId,
      jurySize: env.jurySize,
      expiresAt
    });

    return res.status(201).json({
      message: "Juriu asignat.",
      ...result,
      expiresAt
    });
  } catch (err) {
    next(err);
  }
}

async function myAssignments(req, res, next) {
  try {
    // doar assigmenturile userului curent 
    const assignments = await prisma.juryAssignment.findMany({
      where: { evaluatorId: req.user.id },
      orderBy: { assignedAt: "desc" },
      select: {
        id: true,
        deliverableId: true,
        assignedAt: true,
        expiresAt: true,
        deliverable: {
          select: {
            title: true,
            deadline: true,
            demoUrl: true,
            project: { select: { id: true, title: true } }
          }
        },
        grade: { select: { id: true, score: true, updatedAt: true } }
      }
    });

    // normalizam scor ca string
    const out = assignments.map(a => ({
      assignmentId: a.id,
      deliverableId: a.deliverableId,
      assignedAt: a.assignedAt,
      expiresAt: a.expiresAt,
      deliverable: a.deliverable,
      myGrade: a.grade ? { gradeId: a.grade.id, score: a.grade.score.toString(), updatedAt: a.grade.updatedAt } : null
    }));

    return res.json({ assignments: out });
  } catch (err) {
    next(err);
  }
}

module.exports = { assignJuryToDeliverable, myAssignments };
