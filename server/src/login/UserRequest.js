"use strict";
import CouchSession from "../CouchSession.js";
import StringUtil from "../../../common/src/util/StringUtil.js";
import Logger from "../../src/logging/Logger.js";

export default class UserRequest {
    static logger() {
        return Logger.instance();
    }

    static instance(userName, password) {
        return new UserRequest(userName, password);
    }

    constructor(userName, password) {
        if(StringUtil.isEmptyString(userName) || StringUtil.isEmptyString(password)) {
            throw new Error("userName or password cannot be empty");
        }
        this.userName = userName.trim();
        this.password = password.trim();
    }

    getToken() {
        return new Promise((resolve, reject) => {
            CouchSession.login(this.userName, this.password)
            .then((authSessionCookieHeader) => {
                let token = this.extractToken(authSessionCookieHeader);
                resolve(token);
            })
            .catch((error) => { //eslint-disable-line
                UserRequest.logger().error("UserRequest:getToken fatal error = %s", error);
                reject("login failed");
            });
        });
    }

    getAuthSessionCookie() {
        return new Promise((resolve, reject) => {
            CouchSession.login(this.userName, this.password)
                .then((authSessionCookieHeader) => {
                    resolve(authSessionCookieHeader);
                })
                .catch((error) => { //eslint-disable-line
                    UserRequest.logger().error("UserRequest:getAuthSessionCookie fatal error %s", error);
                    reject("login failed");
                });
        });

    }

    getUserName(token) {
        return new Promise((resolve, reject) => {
            CouchSession.authenticate(token)
            .then((userName) => {
                UserRequest.logger().info("UserRequest:getUserName userName = %s", userName);
                resolve(userName);
            }).catch(error => { //eslint-disable-line
                UserRequest.logger().error("UserRequest:getUserName fatal error %s", error);
                reject("can not get the user name");
            });
        });
    }

    extractToken(authSessionCookie) {
        return authSessionCookie.split("=")[1].split(";")[0];
    }
}
