const requestLogger = (req, res, next) => {
  const start = Date.now();
  console.log(`${req.method} ${req.url}`);

  res.on("finish", () => {
    const duration = Date.now() - start;
    console.log(`${req.method} ${req.url} -> ${res.statusCode} (${duration}ms)`);
  });

  // Call next() so the request can move to the route handlers
  next();
};

module.exports = requestLogger;