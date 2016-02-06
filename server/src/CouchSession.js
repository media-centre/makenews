"use strict";

import ApplicationConfig from "./config/ApplicationConfig.js";
import NodeErrorHandler from "./NodeErrorHandler.js";
import StringUtil from "../../common/src/util/StringUtil.js";
import HttpResponseHandler from "../../common/src/HttpResponseHandler.js";
import request from "request";
import querystring from "querystring";


export default class CouchSession {
  static login(username, password) {
      return new Promise((resolve, reject) => {
          request.post({
              "uri": ApplicationConfig.instance().dbUrl() + "/_session",
              "headers": { "content-type": "application/x-www-form-urlencoded" },
              "body": querystring.stringify({ "name": username, "password": password })
          },
        (error, response) => {
            if(CouchSession.requestSuccessful(error, response)) {
                resolve(response.headers["set-cookie"][0]);
            }
            reject(error);
        });
      });
  }

  static authenticate(token) {
      let authSessionToken = "AuthSession=" + token;
      return new Promise((resolve, reject) => {
          request.get({
              "url": ApplicationConfig.instance().dbUrl() + "/_session",
              "headers": {
                  "Cookie": authSessionToken
              }
          }, (error, response, body) => {
              if(CouchSession.requestSuccessful(error, response)) {
                  let userJson = JSON.parse(body);
                  if(StringUtil.validNonEmptyString(userJson.userCtx.name)) {
                      if(response.headers["set-cookie"]) {
                          resolve(response.headers["set-cookie"][0]);
                      } else {
                          resolve(authSessionToken);
                      }
                  } else {
                      reject("");
                  }
              } else {
                  reject(error);
              }
          });
      });
  }

  static requestSuccessful(error, response) {
      return NodeErrorHandler.noError(error) && (response.statusCode === HttpResponseHandler.codes.OK);
  }
}
