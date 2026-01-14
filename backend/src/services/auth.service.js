const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { env } = require("../config/env");

// Hasheaza parola folosind bcrypt.
async function hashPassword(password) {
  return bcrypt.hash(password, 10);
}

// Verifica daca parola corespunde cu hash-ul stocat.
async function verifyPassword(password, passwordHash) {
  return bcrypt.compare(password, passwordHash);
}

// Genereaza un token JWT pentru utilizatorul autentificat.
function signToken(user) {
  return jwt.sign(
    { role: user.role },
    env.jwtSecret,
    { subject: user.id, expiresIn: env.jwtExpiresIn }
  );
}

module.exports = { hashPassword, verifyPassword, signToken };
