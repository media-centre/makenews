"use strict";

import CouchSession from "../CouchSession";
import CouchClient from "../CouchClient";
import ApplicationConfig from "../config/ApplicationConfig";
import DateUtil from "../util/DateUtil";

let _dbInstance = null, loginTime = null;
export default class AdminDbClient {
    static instance() {
        return new AdminDbClient();
    }

    getDb() {
        return new Promise((resolve, reject) => {
            if(AdminDbClient.getDbInstance() && !AdminDbClient.isSessionExpired()) {
                resolve(AdminDbClient.getDbInstance());
            } else {
                const adminDetails = ApplicationConfig.instance().adminDetails();
                CouchSession.login(adminDetails.username, adminDetails.password).then((token) => {
                    if(token && token.split(";")[0]) {
                        this.accessToken = token.split(";")[0].split("=")[1];
                    }
                    _dbInstance = CouchClient.instance(adminDetails.db, this.accessToken);
                    loginTime = DateUtil.getCurrentTime();
                    resolve(_dbInstance);
                }).catch((error) => {
                    reject(error);
                });
            }
        });
    }

    getDocument(documentId) {
        return new Promise((resolve, reject) => {
            this.getDb().then((dbInstance) => {
                dbInstance.getDocument(documentId).then((document) => {
                    resolve(document);
                }).catch((error) => {
                    reject(error);
                });
            }).catch((error) => {
                reject(error);
            });
        });
    }


    static isSessionExpired() {
        let minutes = 5, seconds = 60, milliseconds = 1000;
        return DateUtil.getCurrentTime() > loginTime + (minutes * seconds * milliseconds);
    }

    static getDbInstance() {
        return _dbInstance;
    }
}
