import CouchSession from "../CouchSession";
import Logger from "../../src/logging/Logger";
import CouchClient from "../CouchClient";

const logger = () => Logger.instance("UserRequest");

export function getToken(username, password) {
    return new Promise((resolve, reject) => {
        CouchSession.login(username, password)
        .then((authSessionCookieHeader) => {
            let token = this.extractToken(authSessionCookieHeader);
            resolve(token);
        })
        .catch((error) => {
            logger().error("UserRequest:getToken fatal error = %s", error);
            reject("login failed");
        });
    });
}

export function getAuthSessionCookie(userName, password) {
    return new Promise((resolve, reject) => {
        CouchSession.login(userName, password)
            .then((authSessionCookieHeader) => {
                resolve(authSessionCookieHeader);
            })
            .catch((error) => {
                logger().error("UserRequest:getAuthSessionCookie fatal error %s", error);
                reject("login failed");
            });
    });

}

export function extractToken(authSessionCookie) {
    return authSessionCookie.split("=")[1].split(";")[0];       // eslint-disable-line no-magic-numbers
}

export function updatePassword(username, newPassword) {
    return new Promise((resolve, reject) => {
        this.getToken().then((token) => {
            CouchSession.updatePassword(username, newPassword, token).then(response => {
                resolve(response);
            }).catch((error) => {
                logger().error("UserRequest:password updation error = %s", error);
                reject(error);
            });
        }).catch((error) => {
            logger().error("UserRequest:getToken fatal error = %s", error);
            reject(error);
        });
    });
}

export async function getUserDetails(token, userName) {
    const dbInstance = CouchClient.instance(token, "_users");
    const path = "/_users/org.couchdb.user:" + userName;
    try {
        return await dbInstance.get(path);
    } catch (err) {
        logger().error("UserRequest:getUserDetails fatal error %s", err);
        throw err;
    }
}

export async function markAsVisitedUser(token, userName) {
    try {
        let userData = await getUserDetails(token, userName);
        userData.visitedUser = true;
        const couchClient = CouchClient.instance(token, "_users");
        await couchClient.updateDocument(userData);
        return { "ok": true };
    } catch (err) {
        logger().error(`UserRequest:MarkAsVistedUser fatal error ${JSON.stringify(err)}`);
        const errMessage = { "message": "not able to update" };
        throw errMessage;
    }
}
