import CouchSession from "../CouchSession";
import Logger from "../../src/logging/Logger";
import CouchClient from "../CouchClient";

const logger = () => Logger.instance("UserRequest");

export async function getToken(username, password) {
    try{
        return await CouchSession.login(username, password);
    }catch(error) {
        logger().error("UserRequest:getToken fatal error = %s", error);
        throw "login failed"; //eslint-disable-line no-throw-literal
    }
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
    // eslint-disable-next-line no-magic-numbers
    return authSessionCookie.split("=")[1].split(";")[0];
}

export async function updatePassword(username, newPassword, currentPassword) {
    try {
        const token = await getToken(username, currentPassword);
        return await CouchSession.updatePassword(username, newPassword, extractToken(token));
    }catch(error) {
        logger().error("UserRequest:password updation error = %s", error);
        throw error;
    }
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
        const couchClient = CouchClient.instance(token, "_users");
        const documentId = "org.couchdb.user:" + userName;
        const couchClientUser = CouchClient.instance(token);
        const selector = {
            "selector": {
                "docType": {
                    "$eq": "source"
                }
            }
        };
        const configuredSources = await couchClientUser.findDocuments(selector);
        if(configuredSources.docs.length) {
            const userData = await couchClient.getDocument(documentId);
            userData.visitedUser = true;
            await couchClient.updateDocument(userData);
            return true;
        }
        return false;
    } catch (err) {
        logger().error(`UserRequest:MarkAsVisitedUser fatal error ${JSON.stringify(err)}`);
        const errMessage = { "message": "not able to update" };
        throw errMessage;
    }
}
