"use strict";

import CouchSession from "../CouchSession";
import CouchClient from "../CouchClient";
import ApplicationConfig from "../config/ApplicationConfig";

let _dbinstance = null;
export default class AdminDbClient {
    static instance() {
        return new AdminDbClient();
    }

    getDb() {
        return new Promise((resolve, reject) => {
            if(AdminDbClient.getDbInstance()) {
                resolve(AdminDbClient.getDbInstance());
            } else {
                const adminDetails = ApplicationConfig.instance().adminDetails();
                CouchSession.login(adminDetails.username, adminDetails.password).then((token) => {
                    if(token && token.split(";")[0]) {
                        this.accessToken = token.split(";")[0].split("=")[1];
                    }
                    _dbinstance = CouchClient.instance(adminDetails.db, this.accessToken);
                    resolve(_dbinstance);
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


    static getDbInstance() {
        return _dbinstance;
    }
}
