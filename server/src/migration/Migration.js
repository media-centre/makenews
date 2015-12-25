/*eslint no-unused-vars:0*/
"use strict";
import CreateCategoryDesignDocument from "../../src/migration/db/20151217145510_CreateCategoryDesignDocument.js";
import CreateDefaultCategoryDocument from "../../src/migration/db/20151217171910_CreateDefaultCategoryDocument.js";
import SchemaInfo from "./SchemaInfo.js";
import MigrationFile from "./MigrationFile.js";
import CouchSession from "../CouchSession.js";
import CouchClient from "../CouchClient.js";
import Logger from "../logging/Logger.js";

export default class Migration {

    static instance(dbName, accessToken) {
        return new Migration(dbName, accessToken);
    }

    constructor(dbName, accessToken) {
        this.dbName = dbName;
        this.accessToken = accessToken;
        console.log("dbName = ", this.dbName);
    }

    static allDbs(adminUserName, password) {
        return new Promise((resolve, reject) => {
            CouchSession.login(adminUserName, password).then(cookieHeader => {
                let accessToken = null;
                if(cookieHeader && cookieHeader.split("=")[1].split(";")[0]) {
                    accessToken = cookieHeader.split("=")[1].split(";")[0];
                }

                CouchClient.getAllDbs().then(dbNames => {
                    let finishedCount = 0, failedCount = 0;
                    dbNames.forEach(dbName => {
                        let migrationInstance = Migration.instance(dbName, accessToken);
                        migrationInstance.start().then(status => {
                            finishedCount = finishedCount + 1;
                            if(finishedCount + failedCount === dbNames.length) {
                                resolve([finishedCount, failedCount]);
                            }
                        });
                    });
                });
            });
        });
    }

    start() {
        return new Promise((resolve, reject) => {
            SchemaInfo.instance(this.dbName, this.accessToken).getSchemaInfoDocument().then(schemaInfoDoc => {
                let schemaVersion = "19700101000000";
                if(schemaInfoDoc) {
                    schemaVersion = schemaInfoDoc.lastMigratedDocumentTimeStamp;
                }
                console.log("schema version in db is ", schemaVersion);
                let migratableFileDetails = MigrationFile.instance().getMigratableFileClassNames(schemaVersion);
                console.log("migratable file names = ", migratableFileDetails);
                this._migrateFileSynchronously(migratableFileDetails).then(success => {
                    console.log("migration succssful");
                    resolve(true);
                }).catch(failure => {
                    console.log("migration failed");
                    reject(false);
                });
            }).catch(error =>{
                reject(error);
            });
        });
    }

    getObject(className) {
        switch (className) {
        case "CreateCategoryDesignDocument" :
            return new CreateCategoryDesignDocument(this.dbName, this.accessToken);
        case "CreateDefaultCategoryDocument" :
            return new CreateDefaultCategoryDocument(this.dbName, this.accessToken);
        default :
            throw new Error("class name : " + className + " not found");
        }
    }

    _migrateFileSynchronously(migratableFileDetails, index = 0) {
        return new Promise((resolve, reject) => {
            if(migratableFileDetails && migratableFileDetails.length > index) {
                this._migrateFile(migratableFileDetails[index]).then(response => {
                    this._migrateFileSynchronously(migratableFileDetails, index + 1).then(status => {
                        resolve(true);
                    }).catch(error => {
                        reject(false);
                    });
                }).catch(error => {
                    reject(false);
                });
            } else {
                resolve(true);
            }
        });
    }

    _migrateFile(fileDetails) {
        return new Promise((resolve, reject) => {
            try {
                this.getObject(fileDetails[1]).up().then(response => {
                    console.log(fileDetails[1], " up is successful");
                    SchemaInfo.instance(this.dbName, this.accessToken).save(fileDetails[0]).then(success => {
                        console.log("saving schema info token " + fileDetails[0] + " is successful.");
                        resolve(success);
                    }).catch(error => {
                        console.log("saving schema info token " + fileDetails[0] + " is failed.");
                        reject(error);
                    });
                }).catch(error => {
                    console.log(fileDetails[1], " error = ", error);
                });
            } catch(error) {
                console.log("getObject for " + fileDetails[1] + " failed.");
                reject(error);
            }
        });
    }
}
