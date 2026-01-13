const { prisma } = require("../prisma/client");
const { HttpError } = require("../utils/httpError");
const { parseScoreToCents, centsToFixed2 } = require("../utils/validate");
const { computeFinalGradeFromCents } = require("../services/grading.service");

async function submitGrade(req, res, next) {
  try {
    const deliverableId = req.params.deliverableId;
    const { score } = req.body;

    const parsed = parseScoreToCents(score);
    if (!parsed.ok) throw new HttpError(400, parsed.error);

    const assignment = await prisma.juryAssignment.findUnique({
      where: {
        deliverableId_evaluatorId: {
          deliverableId,
          evaluatorId: req.user.id
        }
      },
      select: { id: true, expiresAt: true }
    });

    if (!assignment) {
      throw new HttpError(403, "Nu esti asignat ca jurat pentru acest livrabil.");
    }

    console.log(`[DEBUG] Checking expiration for assignment ${assignment.id}`);
    console.log(`[DEBUG] Current Time: ${new Date().toISOString()}`);
    console.log(`[DEBUG] Expires At:   ${assignment.expiresAt.toISOString()}`);

    if (new Date() > assignment.expiresAt) {
      console.log(`[DEBUG] EXPIRED!`);
      throw new HttpError(403, "Termenul de evaluare a expirat.");
    }

    const scoreStr = centsToFixed2(parsed.cents); // string "9.50"

    // upsert pe juryAssignmentId (unique)
    const grade = await prisma.grade.upsert({
      where: { juryAssignmentId: assignment.id },
      create: {
        juryAssignmentId: assignment.id,
        score: scoreStr
      },
      update: {
        score: scoreStr
      },
      select: { id: true, score: true, createdAt: true, updatedAt: true }
    });

    return res.status(201).json({
      message: "Nota salvata.",
      grade: { ...grade, score: grade.score.toString() }
    });
  } catch (err) {
    next(err);
  }
}

async function getGradesForDeliverable(req, res, next) {
  try {
    const deliverableId = req.params.deliverableId;

    const deliverable = await prisma.deliverable.findUnique({
      where: { id: deliverableId },
      select: {
        id: true,
        title: true,
        project: { select: { id: true, ownerId: true, title: true, teamId: true } },
        assignments: {
          select: {
            grade: { select: { id: true, score: true, createdAt: true, updatedAt: true } }
          }
        }
      }
    });

    if (!deliverable) throw new HttpError(404, "Livrabil inexistent.");

    const isTeacher = req.user.role === "TEACHER";
    const isOwner = deliverable.project.ownerId === req.user.id;

    let isTeamMember = false;
    if (deliverable.project.teamId) {
      const membership = await prisma.teamMember.findUnique({
        where: { teamId_userId: { teamId: deliverable.project.teamId, userId: req.user.id } }
      });
      if (membership) isTeamMember = true;
      else {
        const team = await prisma.team.findUnique({ where: { id: deliverable.project.teamId }, select: { ownerId: true } });
        if (team && team.ownerId === req.user.id) isTeamMember = true;
      }
    }

    if (!isTeacher && !isOwner && !isTeamMember) {
      throw new HttpError(403, "Acces interzis la notele acestui livrabil.");
    }

    const grades = deliverable.assignments
      .map(a => a.grade)
      .filter(g => !!g);

    const scoreCentsList = grades.map(g => {
      // Decimal -> string -> cents
      const s = g.score.toString();
      const cents = Math.round(Number(s) * 100);
      return cents;
    });

    const computed = computeFinalGradeFromCents(scoreCentsList);

    // Teacher vede notele individuale, dar anonime (fara evaluatorId)
    if (isTeacher) {
      const gradesAnon = grades.map(g => ({
        gradeId: g.id,
        score: g.score.toString(),
        createdAt: g.createdAt,
        updatedAt: g.updatedAt
      }));

      return res.json({
        deliverable: {
          id: deliverable.id,
          title: deliverable.title,
          projectId: deliverable.project.id,
          projectTitle: deliverable.project.title
        },
        gradesCount: gradesAnon.length,
        status: computed.status,
        finalGrade: computed.finalGrade,
        grades: gradesAnon
      });
    }

    // Ownerul  vede doar rezultatul final + cate note sunt
    return res.json({
      deliverable: {
        id: deliverable.id,
        title: deliverable.title,
        projectId: deliverable.project.id,
        projectTitle: deliverable.project.title
      },
      gradesCount: grades.length,
      status: computed.status,
      finalGrade: computed.finalGrade
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { submitGrade, getGradesForDeliverable };
