import CouchSession from "../CouchSession.js";
import HttpResponseHandler from "../../../common/src/HttpResponseHandler.js";
import StringUtil from "../../../common/src/util/StringUtil.js";
import BoolUtil from "../../../common/src/util/BoolUtil.js";

export class AuthorizationRoutes {
  static loginCallback(request, response) {

    if(BoolUtil.isEmpty(request) || BoolUtil.isEmpty(response)) {
        throw new Error("request or response can not be empty");
    }

    if(AuthorizationRoutes.inValidUserInput(request.body.username, request.body.password)) {
        AuthorizationRoutes.handleInvalidInput(response);
    }else{
        CouchSession.login(request.body.username, request.body.password)
            .then((token) => {
                AuthorizationRoutes.handleLoginSuccess(response, token);
            })
            .catch(() => {
                AuthorizationRoutes.handleLoginFailure(response);
            });
    }
  }

  static handleLoginSuccess(response, token) {
      response.status(HttpResponseHandler.codes.OK)
          .append('Set-Cookie', token)
          .json({"message": "login successful"});
  }

  static handleLoginFailure(response) {
      response.status(HttpResponseHandler.codes.UNAUTHORIZED)
          .json({"message": "unauthorized"});
  }

  static handleInvalidInput(response) {
      response.status(HttpResponseHandler.codes.UNAUTHORIZED)
          .json({"message": "invalid user or password"});
  }

  static inValidUserInput(userName, password) {
      if(StringUtil.trim(userName) === "" || StringUtil.trim(password) === "") {
          return true;
      }
      return false;
  }

  static allUrlsCallback(request, next) {
    if(AuthorizationRoutes.whiteList(request.originalUrl)) {
      next();
    }else if (request.cookies.AuthSession) {
          CouchSession.authenitcate(request.cookies.AuthSession)
          .then((userName) => {
              next();
          }).catch((error) => {
             proceedToUnAuthorizedError();
          });
    }else{
        console.log("here 1....");
        proceedToUnAuthorizedError();
        console.log("here 2....");
    }
    function proceedToUnAuthorizedError() {
      let error = new Error("unthorized");
      error.status = HttpResponseHandler.codes.UNAUTHORIZED;
      next(error);
    }
  }

  static whiteList(url) {
      if(BoolUtil.isEmpty(url)) {
          throw new Error("url can not be empty");
      }

      let whitelistUrls = ['/', '/login', '/app.js', '/app.css', '/images/newspaper.jpg'];
      const negativeIndex = -1;
      if(whitelistUrls.indexOf(url) !== negativeIndex) {
          return true;
      }
      return false;
  }
}

export default (app) => {
  app.post('/login', (request, response) => {
    AuthorizationRoutes.loginCallback(request, response);
  });

  app.use((request, response, next) => {
      AuthorizationRoutes.allUrlsCallback(request, next);
  });
}
