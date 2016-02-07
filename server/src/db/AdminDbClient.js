"use strict";

import CouchSession from "../CouchSession";
import CouchClient from "../CouchClient";
import DateUtil from "../util/DateUtil";
import Logger, { logCategories } from "../logging/Logger";

let dbInstanceMap = new Map();
export default class AdminDbClient extends CouchClient {

    constructor(userName, token) {
        super(userName, token);
    }

    static logger() {
        return Logger.instance(logCategories.DATABASE);
    }

    static instance(userName, password, db) {
        return new Promise((resolve, reject) => {
            if(AdminDbClient.isSessionExpired(userName)) {
                AdminDbClient.logger().debug("AdminDbClient:: session expired for %s. Attempting to get token.", userName);
                CouchSession.login(userName, password).then((token) => {
                    AdminDbClient.logger().debug("AdminDbClient:: received token.");
                    resolve(AdminDbClient.createInstance(token, db, userName));
                }).catch((error) => {
                    AdminDbClient.logger().error("AdminDbClient:: login failed for %s", userName);
                    reject(error);
                });
            } else {
                resolve(AdminDbClient.getDbInstance(userName).instance);
            }
        });
    }

    static createInstance(token, db, userName) {
        let accessToken = "";
        if (token && token.split(";")[0]) {
            accessToken = token.split(";")[0].split("=")[1];
        }
        const adminDbClient = new AdminDbClient(db, accessToken);
        dbInstanceMap.set(userName, { "instance": adminDbClient, "expiration": AdminDbClient.getExpirationTime() });
        return adminDbClient;
    }

    createUser(userName, password) {
        const path = "/_users/org.couchdb.user:" + userName;
        const body = { "_id": "org.couchdb.user:" + userName, "name": userName, "roles": [], "type": "user", "password": password, "generated": true };
        return this.put(path, body);
    }

    createDb(dbName) {
        return this.put("/" + dbName);
    }


    setPermissions(userName, dbName) {
        const path = "/" + dbName + "/_security";
        const body = { "admins": { "names": [], "roles": [] }, "members": { "names": [userName], "roles": [] } };
        return this.put(path, body);
    }

    static getExpirationTime() {
        let minutes = 5, seconds = 60, milliseconds = 1000;
        return DateUtil.getCurrentTime() + (minutes * seconds * milliseconds);
    }

    static isSessionExpired(userName) {
        let dbInstance = AdminDbClient.getDbInstance(userName);
        if(!dbInstance) {
            return true;
        }
        return DateUtil.getCurrentTime() > dbInstance.expiration;
    }

    static getDbInstance(userName) {
        return dbInstanceMap.get(userName);
    }
}
