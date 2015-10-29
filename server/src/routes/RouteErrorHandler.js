export default function routeErrorHandler(app) {
  app.use((err, req, res, next) => {
    if (err.status !== 401) {
      next();
    }
    res.status(401);
    res.send("Unauthorised");
  });
}