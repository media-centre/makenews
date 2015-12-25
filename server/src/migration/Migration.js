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

    static logger(dbName) {
        if(!this.logs) {
            this.logs = {};
        }
        this.logs[dbName] = this.logs[dbName] || Logger.instance("migration-" + dbName);
        return this.logs[dbName];
    }

    static instance(dbName, accessToken) {
        return new Migration(dbName, accessToken);
    }

    constructor(dbName, accessToken) {
        this.dbName = dbName;
        this.accessToken = accessToken;
        Migration.logger(this.dbName).info("dbName = %s", this.dbName);
    }

    static allDbs(adminUserName, password) {
        return new Promise((resolve, reject) => {
            let allDbMigrationLogger = Logger.instance("migration-alldbs");

            CouchSession.login(adminUserName, password).then(cookieHeader => {
                let accessToken = null;
                if(cookieHeader && cookieHeader.split("=")[1].split(";")[0]) {
                    accessToken = cookieHeader.split("=")[1].split(";")[0];
                }

                CouchClient.getAllDbs().then(dbNames => {
                    allDbMigrationLogger.info("all dbs = %s", dbNames);
                    let finishedCount = 0, failedCount = 0;
                    dbNames.forEach(dbName => { //eslint-disable-line
                        allDbMigrationLogger.info("%s migration started", dbName);
                        let migrationInstance = Migration.instance(dbName, accessToken);
                        migrationInstance.start().then(status => { //eslint-disable-line
                            allDbMigrationLogger.info("%s migration completed", dbName);
                            finishedCount += 1;
                            if(finishedCount + failedCount === dbNames.length) {
                                allDbMigrationLogger.info("[success-count, failed-count] = [%s]", finishedCount, failedCount);
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
                Migration.logger(this.dbName).info("schema version in db is %s ", schemaVersion);
                let migratableFileDetails = MigrationFile.instance().getMigratableFileClassNames(schemaVersion);
                Migration.logger(this.dbName).info("migratable file names = %j", migratableFileDetails);
                this._migrateFileSynchronously(migratableFileDetails).then(success => {
                    Migration.logger(this.dbName).info("migration successful.");
                    resolve(true);
                }).catch(failure => {
                    Migration.logger(this.dbName).error("migration failed");
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
                    Migration.logger(this.dbName).info("%s::up is successful", fileDetails[1]);
                    SchemaInfo.instance(this.dbName, this.accessToken).save(fileDetails[0]).then(success => {
                        Migration.logger(this.dbName).info("saving schema info token %s is successful.", fileDetails[0]);
                        resolve(success);
                    }).catch(error => {
                        Migration.logger(this.dbName).error("saving schema info token %s is failed.", fileDetails[0]);
                        reject(error);
                    });
                }).catch(error => {
                    Migration.logger(this.dbName).error("%s error = %s", fileDetails[1], error);
                });
            } catch(error) {
                Migration.logger(this.dbName).error("getObject for %s failed.", fileDetails[1]);
                reject(error);
            }
        });
    }
}
