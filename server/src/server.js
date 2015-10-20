var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
const port = process.env.PORT || 5000;
var Session = require('./session');
app.use(cookieParser());

app.use((req, res, next) => {
  var unAuthorisedError = (errMsg) => {
    var err = new Error();
    err.status = 401;
    next(err);
  };
  var allowedUrls = ['/'];
  if(allowedUrls.indexOf(req.originalUrl) != -1) {
    next();
  }
  else if(req.cookies['AuthSession']) {
    Session.currentUser(req.cookies['AuthSession'])
      .then((username) => {
        next();
      }).catch(unAuthorisedError);
  }
  else {
    unAuthorisedError();
  }
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/', express.static(path.join(__dirname, '../../client')));
app.get('/welcome', (req,res, next) => {
  res.send("welcome");
});

app.use((err, req, res, next) => {
  if(err.status != 401) {
    next();
  }
  res.status(401);
  res.send("Unauthorised");
});

var server = app.listen(port);
console.log('listening on port ' + port);
module.exports = server;