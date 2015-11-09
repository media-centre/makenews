import DbParameters from "../config/DbParameters.js";
import NodeErrorHandler from "./NodeErrorHandler.js";
import CouchResponseHandler from "./CouchResponseHandler.js";
import StringUtil from "../../common/src/util/StringUtil.js";
import request from "request";
import querystring from "querystring";

export default class CouchSession {
  static login(username, password) {
      return new Promise((resolve, reject) => {
        request.post({
            uri: DbParameters.dbUrl + "/_session",
            headers: { "content-type": "application/x-www-form-urlencoded" },
            body: querystring.stringify({ name: username, password: password })
        },
        (error, response) => {
            if(CouchSession.requestSuccessful(error, response)) {
              resolve(response.headers["set-cookie"][0]);
          }
            reject(error);
        });
    });
  }

  static authenitcate(token) {
      return new Promise((resolve, reject) => {
          request.get({
            url: DbParameters.dbUrl + "/_session",
            headers: {
              "Cookie": "AuthSession=" + token
          }
        }, (error, response, body) => {
            if(CouchSession.requestSuccessful(error, response)) {
                let userJson = JSON.parse(body);

                if(StringUtil.validNonEmptyString(userJson.userCtx.name)) {
                    resolve(userJson.userCtx.name);
                }
                reject("");
            }
            reject(error);
        });
      });
  }

  static requestSuccessful(error, response) {
      if(NodeErrorHandler.noError(error) && CouchResponseHandler.requestCompleted(response.statusCode)) {
          return true;
      }
      return false;
  }
}
