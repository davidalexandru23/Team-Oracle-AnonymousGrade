function requireTeacher(req, res, next) {
  if (req.user?.role !== "TEACHER") {
    return res.status(403).json({ error: "Acces interzis. Necesita rol TEACHER." });
  }
  next();
}

function requireStudent(req, res, next) {
  if (req.user?.role !== "STUDENT") {
    return res.status(403).json({ error: "Acces interzis. Necesita rol STUDENT." });
  }
  next();
}

module.exports = { requireTeacher, requireStudent };
