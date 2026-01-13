const { prisma } = require("../prisma/client");
const { HttpError } = require("../utils/httpError");

// Return teams user is owner OR member of
async function listTeams(userId) {
    const teams = await prisma.team.findMany({
        where: {
            OR: [
                { ownerId: userId },
                { members: { some: { userId } } }
            ]
        },
        include: {
            owner: { select: { id: true, name: true, email: true } },
            members: {
                include: {
                    user: { select: { id: true, name: true, email: true } }
                }
            },
            projects: { select: { id: true, title: true, description: true } }
        },
        orderBy: { createdAt: "desc" }
    });

    // Flatten structure for easier consumption
    return teams.map(t => ({
        id: t.id,
        name: t.name,
        description: t.description,
        ownerId: t.ownerId,
        owner: t.owner,
        members: t.members.map(m => ({
            id: m.id, // membership ID but actually we want user info mostly
            userId: m.userId,
            name: m.user.name,
            email: m.user.email,
            joinedAt: m.joinedAt
        })),
        projects: t.projects
    }));
}

async function getTeam(teamId, userId) {
    const team = await prisma.team.findUnique({
        where: { id: teamId },
        include: {
            owner: { select: { id: true, name: true, email: true } },
            members: {
                include: {
                    user: { select: { id: true, name: true, email: true } }
                }
            },
            projects: { select: { id: true, title: true, description: true } }
        }
    });

    if (!team) {
        throw new HttpError(404, "Echipa nu exista.");
    }

    // Check access: owner OR member
    const isOwner = team.ownerId === userId;
    const isMember = team.members.some(m => m.userId === userId);

    if (!isOwner && !isMember) {
        throw new HttpError(403, "Nu ai acces la aceasta echipa.");
    }

    return {
        id: team.id,
        name: team.name,
        description: team.description,
        ownerId: team.ownerId,
        owner: team.owner,
        members: team.members.map(m => ({
            id: m.id,
            userId: m.userId,
            name: m.user.name,
            email: m.user.email,
            joinedAt: m.joinedAt
        })),
        projects: team.projects
    };
}

async function createTeam(ownerId, name, description) {
    const team = await prisma.team.create({
        data: {
            ownerId,
            name,
            description
        }
    });
    return team;
}

async function addMember(teamId, requestingUserId, email) {
    // Check auth and team existence
    const team = await prisma.team.findUnique({ where: { id: teamId } });
    if (!team) throw new HttpError(404, "Echipa nu exista.");
    if (team.ownerId !== requestingUserId) {
        throw new HttpError(403, "Doar ownerul poate adauga membri.");
    }

    // Find user to add
    const userToAdd = await prisma.user.findUnique({ where: { email } });
    if (!userToAdd) {
        throw new HttpError(404, "Utilizatorul cu acest email nu exista.");
    }

    if (userToAdd.role !== "STUDENT") {
        throw new HttpError(400, "Doar studentii pot fi membri in echipe.");
    }

    // Check if already in team
    const existing = await prisma.teamMember.findUnique({
        where: {
            teamId_userId: { teamId, userId: userToAdd.id }
        }
    });
    if (existing) {
        throw new HttpError(409, "Utilizatorul este deja in echipa.");
    }

    // Add
    await prisma.teamMember.create({
        data: {
            teamId,
            userId: userToAdd.id
        }
    });

    return { message: "Membru adaugat.", member: { id: userToAdd.id, name: userToAdd.name, email: userToAdd.email } };
}

async function removeMember(teamId, requestingUserId, memberId) {
    // memberId here refers to the User ID we want to remove? 
    // The API spec says `DELETE /teams/:teamId/members/:memberId`. Usually memberId implies User ID in this context or TeamMember ID.
    // Let's assume User ID for consistency with "add member". But strictly REST usually implies resource ID.
    // Given standard practices, let's treat :memberId as the User ID to remove.  

    const team = await prisma.team.findUnique({ where: { id: teamId } });
    if (!team) throw new HttpError(404, "Echipa nu exista.");
    if (team.ownerId !== requestingUserId) {
        throw new HttpError(403, "Doar ownerul poate sterge membri.");
    }

    // We need to delete from TeamMember based on teamId + userId
    // OR based on TeamMember.id. 
    // Let's search by userId first.
    const membership = await prisma.teamMember.findUnique({
        where: { teamId_userId: { teamId, userId: memberId } }
    });

    if (!membership) {
        throw new HttpError(404, "Utilizatorul nu este membru in aceasta echipa.");
    }

    await prisma.teamMember.delete({
        where: { id: membership.id }
    });

    return { message: "Membru sters." };
}

async function addProject(teamId, requestingUserId, projectId) {
    const team = await prisma.team.findUnique({ where: { id: teamId } });
    if (!team) throw new HttpError(404, "Echipa nu exista.");
    if (team.ownerId !== requestingUserId) {
        throw new HttpError(403, "Doar ownerul poate adauga proiecte.");
    }

    const project = await prisma.project.findUnique({ where: { id: projectId } });
    if (!project) throw new HttpError(404, "Proiectul nu exista.");

    // Check if project belongs to owner?Usually yes, or at least they should have access.
    if (project.ownerId !== requestingUserId) {
        throw new HttpError(403, "Trebuie sa fii ownerul proiectului pentru a-l atasa echipei.");
    }

    if (project.teamId) {
        throw new HttpError(409, "Proiectul este deja asignat unei echipe.");
    }

    const updated = await prisma.project.update({
        where: { id: projectId },
        data: { teamId },
        select: { id: true, title: true, description: true, teamId: true }
    });

    return { project: updated };
}

async function createTeamProject(teamId, requestingUserId, title, description) {
    const team = await prisma.team.findUnique({ where: { id: teamId } });
    if (!team) throw new HttpError(404, "Echipa nu exista.");
    if (team.ownerId !== requestingUserId) {
        throw new HttpError(403, "Doar ownerul poate adauga proiecte.");
    }

    const project = await prisma.project.create({
        data: {
            ownerId: requestingUserId,
            teamId,
            title,
            description
        },
        select: { id: true, title: true, description: true, teamId: true }
    });

    return project;
}

module.exports = {
    listTeams,
    getTeam,
    createTeam,
    addMember,
    removeMember,
    addProject,
    createTeamProject
};
