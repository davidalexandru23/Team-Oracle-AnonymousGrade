const { prisma } = require("../prisma/client");
const { shuffleInPlace } = require("../utils/random");
const { HttpError } = require("../utils/httpError");

async function assignJury({ deliverableId, jurySize, expiresAt }) {
  // luam livrabil + owner ca sa excludem ownerul
  const deliverable = await prisma.deliverable.findUnique({
    where: { id: deliverableId },
    select: {
      id: true,
      project: { select: { ownerId: true } }
    }
  });

  if (!deliverable) {
    throw new HttpError(404, "Livrabil inexistent.");
  }

  // daca exista deja asignari, nu mai facem 
  const existingCount = await prisma.juryAssignment.count({
    where: { deliverableId }
  });

  if (existingCount > 0) {
    throw new HttpError(400, "Juriul este deja asignat pentru acest livrabil.");
  }

  const ownerId = deliverable.project.ownerId;

  const students = await prisma.user.findMany({
    where: {
      role: "STUDENT",
      NOT: { id: ownerId }
    },
    select: { id: true }
  });

  if (students.length === 0) {
    throw new HttpError(400, "Nu exista studenti eligibili pentru juriu.");
  }

  const studentIds = students.map(s => s.id);
  shuffleInPlace(studentIds);

  const pickedIds = studentIds.slice(0, Math.min(jurySize, studentIds.length));

  const data = pickedIds.map(evaluatorId => ({
    deliverableId,
    evaluatorId,
    expiresAt
  }));

  const created = await prisma.juryAssignment.createMany({ data });

  return { assignmentsCreated: created.count, jurySize: pickedIds.length };
}

module.exports = { assignJury };
