require("dotenv").config();

function mustGet(name) {
  const v = process.env[name];
  if (!v) throw new Error(`Lipseste variabila de mediu: ${name}`);
  return v;
}

function toIntOrDefault(value, def) {
  const n = Number(value);
  return Number.isFinite(n) ? n : def;
}

const env = {
  port: toIntOrDefault(process.env.PORT, 3000),
  databaseUrl: mustGet("DATABASE_URL"),
  jwtSecret: mustGet("JWT_SECRET"),
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
  jurySize: toIntOrDefault(process.env.JURY_SIZE, 5),
  assignmentExpiresHours: toIntOrDefault(process.env.ASSIGNMENT_EXPIRES_HOURS, 48)
};

module.exports = { env };
