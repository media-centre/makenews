import CouchSession from "../CouchSession";
import StringUtil from "../../../common/src/util/StringUtil";
import Logger from "../../src/logging/Logger";

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

    extractToken(authSessionCookie) {
        return authSessionCookie.split("=")[1].split(";")[0];       // eslint-disable-line no-magic-numbers
    }

    updatePassword(newPassword) {
        return new Promise((resolve, reject) => {
            this.getToken().then((token) => {
                CouchSession.updatePassword(this.userName, newPassword, token).then(response => {
                    resolve(response);
                }).catch((error) => {
                    UserRequest.logger().error("UserRequest:password updation error = %s", error);
                    reject(error);
                });
            }).catch((error) => {
                UserRequest.logger().error("UserRequest:getToken fatal error = %s", error);
                reject(error);
            });
        });
    }
}
