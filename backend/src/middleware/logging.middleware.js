const requestLogger = (req, res, next) => {
  console.log(`Apel primit: ${req.method} ${req.url}`);

  res.on("finish", () => {
    console.log(
      `Raspuns trimis pentru ${req.method} ${req.url} cu status ${res.statusCode}`
    );
  });

  next();
};

module.exports = { requestLogger };
