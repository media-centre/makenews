import Session from '../CouchSession.js';

export default function (app) {
  app.post('/login', (req, res) => {
    if(req.body.username === "" || req.body.password === "") {
      res.status(401).json({"status":"error", "message": "cannot be blank"});
    }
    Session.login(req.body.username, req.body.password)
      .then((token) => {
        res.status(200).append('Set-Cookie', token).json({"status":"success", "message": ""});
      })
      .catch(() => {
        res.status(401).json({"status":"error", "message": "unauthorized"});
      });
  });

  app.use((req, res, next) => {
    let allowedUrls = ['/', '/login', '/app.js', '/app.css', '/images/newspaper.jpg'];
    if(allowedUrls.indexOf(req.originalUrl) !== -1) {
      next();
    } else if (req.cookies.AuthSession) {
      Session.currentUser(req.cookies.AuthSession)
        .then(() => {
          next();
        }).catch(() => {
          unAuthorisedError();
        });
    } else {
      unAuthorisedError();
    }
    let unAuthorisedError = () => {
      let error = new Error();
      error.status = 401;
      next(error);
    };
  });
}
