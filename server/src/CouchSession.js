import ApplicationConfig from "./config/ApplicationConfig";
import NodeErrorHandler from "./NodeErrorHandler";
import StringUtil from "../../common/src/util/StringUtil";
import HttpResponseHandler from "../../common/src/HttpResponseHandler";
import Logger, { logCategories } from "./logging/Logger";
import CouchClient from "./CouchClient";
import { userDetails } from "./Factory";
import request from "request";
import querystring from "querystring";

export default class CouchSession {
    static logger() {
        return Logger.instance(logCategories.DATABASE);
    }

    static login(username, password) {
        return new Promise((resolve, reject) => {
            request.post({
                "uri": ApplicationConfig.instance().dbUrl() + "/_session",
                "headers": { "content-type": "application/x-www-form-urlencoded" },
                "body": querystring.stringify({ "name": username, "password": password })
            },
            (error, response) => {
                if(NodeErrorHandler.noError(error)) {
                    if(response.statusCode === HttpResponseHandler.codes.OK) {
                        CouchSession.logger().debug("CouchSession:: login successful for user '%s'.", username);
                        resolve(response.headers["set-cookie"][0]);  //eslint-disable-line no-magic-numbers
                    } else {
                        reject(response.body);
                    }
                } else {
                    CouchSession.logger().error("CouchSession:: login unsuccessful for user '%s'. Error: %s", username, error);
                    reject(error);
                }
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
                    CouchSession.logger().debug("CouchSession:: authenticating user successful.");
                    if(StringUtil.validNonEmptyString(userJson.userCtx.name)) {
                        if(response.headers["set-cookie"]) {
                            let [authSessionCookie] = response.headers["set-cookie"];
                            let [authSession] = authSessionCookie.split(";");
                            let [, newToken] = authSession.split("=");
                            if(newToken !== token) { //eslint-disable-line max-depth
                                userDetails.removeUser(token);
                                userDetails.updateUser(newToken, userJson.userCtx.name);
                            }
                            resolve(newToken);
                        } else {
                            if(!userDetails.getUser(token)) { //eslint-disable-line max-depth
                                userDetails.updateUser(token, userJson.userCtx.name);
                            }
                            resolve(token);
                        }
                    } else {
                        CouchSession.logger().error("CouchSession:: authentication failed.");
                        reject("unauthenticated user");
                    }
                } else {
                    CouchSession.logger().error("CouchSession:: authentication failed. Error: %s", error);
                    reject(error);
                }
            });
        });
    }

    static async updatePassword(username, newPassword, token) {
        const couchClient = CouchClient.instance(token, "_users");
        const documentId = "org.couchdb.user:" + username;
        const userDocument = await couchClient.getDocument(documentId);
        userDocument.password = newPassword;
        return await couchClient.saveDocument(documentId, userDocument);
    }

    static requestSuccessful(error, response) {
        return NodeErrorHandler.noError(error) && (response.statusCode === HttpResponseHandler.codes.OK);
    }
}
