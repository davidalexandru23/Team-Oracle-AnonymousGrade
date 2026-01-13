const { HttpError } = require("../utils/httpError");

function errorHandler(err, req, res, next) {
  if (err instanceof HttpError) {
    return res.status(err.statusCode).json({ error: err.message });
  }

  console.error(err);
  return res.status(500).json({ error: "Eroare server." });
}

module.exports = { errorHandler };
