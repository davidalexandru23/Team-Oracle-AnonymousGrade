const { prisma } = require("../prisma/client");
const { HttpError } = require("../utils/httpError");
const { isValidEmail, isValidPassword } = require("../utils/validate");
const { hashPassword, verifyPassword, signToken } = require("../services/auth.service");

async function register(req, res, next) {
  try {
    const { name, email, password, role } = req.body;

    if (!name || typeof name !== "string") {
      throw new HttpError(400, "Numele este obligatoriu.");
    }
    if (!isValidEmail(email)) {
      throw new HttpError(400, "Email invalid.");
    }
    if (!isValidPassword(password)) {
      throw new HttpError(400, "Parola trebuie sa aiba minim 8 caractere.");
    }

    // accept doar STUDENT sau TEACHER
    let userRole = "STUDENT";
    if (role !== undefined) {
      if (role !== "STUDENT" && role !== "TEACHER") {
        throw new HttpError(400, "Rol invalid. Foloseste STUDENT sau TEACHER.");
      }
      userRole = role;
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      throw new HttpError(409, "Exista deja un cont cu acest email.");
    }

    const passwordHash = await hashPassword(password);

    const user = await prisma.user.create({
      data: { name, email, passwordHash, role: userRole },
      select: { id: true, name: true, email: true, role: true, createdAt: true }
    });

    const token = signToken(user);

    return res.status(201).json({ user, token });
  } catch (err) {
    next(err);
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!isValidEmail(email)) {
      throw new HttpError(400, "Email invalid.");
    }
    if (typeof password !== "string" || password.length === 0) {
      throw new HttpError(400, "Parola este obligatorie.");
    }

    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true, name: true, email: true, role: true, passwordHash: true }
    });

    if (!user) {
      throw new HttpError(401, "Credentiale gresite.");
    }

    const ok = await verifyPassword(password, user.passwordHash);
    if (!ok) {
      throw new HttpError(401, "Credentiale gresite.");
    }

    const safeUser = { id: user.id, name: user.name, email: user.email, role: user.role };
    const token = signToken(safeUser);

    return res.json({ user: safeUser, token });
  } catch (err) {
    next(err);
  }
}

async function me(req, res) {
  return res.json({ user: req.user });
}

module.exports = { register, login, me };
