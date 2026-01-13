const jwt = require("jsonwebtoken");
const { env } = require("../config/env");
const { prisma } = require("../prisma/client");

async function requireAuth(req, res, next) {
  try {
    const header = req.headers.authorization || "";
    const [type, token] = header.split(" ");

    if (type !== "Bearer" || !token) {
      return res.status(401).json({ error: "Lipseste token-ul JWT (Authorization: Bearer ...)." });
    }

    const payload = jwt.verify(token, env.jwtSecret);

    const user = await prisma.user.findUnique({
      where: { id: payload.sub },
      select: { id: true, role: true, name: true, email: true }
    });

    if (!user) {
      return res.status(401).json({ error: "Token invalid (user inexistent)." });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Token invalid sau expirat." });
  }
}

module.exports = { requireAuth };
