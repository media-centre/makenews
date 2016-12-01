/*eslint no-unused-vars:0*/
import CreateCategoryDesignDocument from "../../src/migration/db/20151217145510_CreateCategoryDesignDocument";
import CreateDefaultCategoryDocument from "../../src/migration/db/20151217171910_CreateDefaultCategoryDocument";
import AddFilterViewsToDesignDocument from "../../src/migration/db/20160205174500_AddFilterViewsToDesignDocument";
import ModifyAllCategoriesByNameView from "../../src/migration/db/20160210182645_ModifyAllCategoriesByNameView";
import AddSourceTypeFilter from "../../src/migration/db/20160212174500_AddSourceTypeFilter";
import ChangeGalleryTypeFeed from "../../src/migration/db/20160310113335_ChangeGalleryTypeFeed";
import ModifyImageUrlToImagesArray from "../../src/migration/db/20160516122916_ModifyImageUrlToImagesArray";
import URLDocument from "../../src/migration/db/20161114174315_URLDocument";
import IndexDocument from "../../src/migration/db/20161130171020_IndexDocument";

import SchemaInfo from "./SchemaInfo";
import MigrationFile from "./MigrationFile";
import CouchSession from "../CouchSession";
import CouchClient from "../CouchClient";
import Logger from "../logging/Logger";

export default class Migration {

    static logger(dbName) {
        if (!this.logs) {
            this.logs = {};
        }
        this.logs[dbName] = this.logs[dbName] || Logger.fileInstance("migration-" + dbName);
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
            let allDbMigrationLogger = Logger.fileInstance("migration-alldbs");
            CouchSession.login(adminUserName, password).then(cookieHeader => {
                let accessToken = null;
                if (cookieHeader && cookieHeader.split("=")[1].split(";")[0]) { // eslint-disable-line no-magic-numbers
                    accessToken = cookieHeader.split("=")[1].split(";")[0];// eslint-disable-line no-magic-numbers
                }

                CouchClient.getAllDbs().then(dbNames => {
                    allDbMigrationLogger.info("all dbs = %s", dbNames);
                    let finishedCount = 0, failedCount = 0;
                    dbNames.forEach(dbName => { //eslint-disable-line
                        allDbMigrationLogger.info("%s migration started", dbName);
                        let migrationInstance = Migration.instance(dbName, accessToken);
                        migrationInstance.start().then(status => { //eslint-disable-line
                            allDbMigrationLogger.info("%s migration completed", dbName);
                            finishedCount += 1; // eslint-disable-line no-magic-numbers
                            resolveStatus(finishedCount, failedCount, dbNames.length);
                        }).catch(error => { //eslint-disable-line
                            allDbMigrationLogger.info("%s migration failed", dbName);
                            failedCount += 1; // eslint-disable-line no-magic-numbers
                            resolveStatus(finishedCount, failedCount, dbNames.length);
                        });
                    });
                }).catch(error => {
                    reject(error);
                });
            }).catch(error => {
                reject(error);
            });
            function resolveStatus(finishedCount, failedCount, totalCount) {
                if (finishedCount + failedCount === totalCount) {
                    allDbMigrationLogger.info("[success-count, failed-count] = [%s]", finishedCount, failedCount);
                    resolve([finishedCount, failedCount]);
                }
            }
        });
    }

    start() {
        return new Promise((resolve, reject) => {
            SchemaInfo.instance(this.dbName, this.accessToken).getSchemaInfoDocument().then(schemaInfoDoc => {
                let schemaVersion = "19700101000000";
                if (schemaInfoDoc) {
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
            }).catch(error => {
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
        case "AddFilterViewsToDesignDocument" :
            return new AddFilterViewsToDesignDocument(this.dbName, this.accessToken);
        case "ModifyAllCategoriesByNameView" :
            return new ModifyAllCategoriesByNameView(this.dbName, this.accessToken);
        case "AddSourceTypeFilter" :
            return new AddSourceTypeFilter(this.dbName, this.accessToken);
        case "ChangeGalleryTypeFeed" :
            return new ChangeGalleryTypeFeed(this.dbName, this.accessToken);
        case "URLDocument" :
            return new URLDocument(this.dbName, this.accessToken);
        case "ModifyImageUrlToImagesArray" :
            return new ModifyImageUrlToImagesArray(this.dbName, this.accessToken);
        case "IndexDocument" :
            return new IndexDocument(this.dbName, this.accessToken);
        default :
            throw new Error("class name : " + className + " not found");
        }
    }

    _migrateFileSynchronously(migratableFileDetails, index = 0) {  // eslint-disable-line no-magic-numbers
        return new Promise((resolve, reject) => {
            if (migratableFileDetails && migratableFileDetails.length > index) {
                this._migrateFile(migratableFileDetails[index]).then(response => {
                    this._migrateFileSynchronously(migratableFileDetails, index + 1).then(status => {  // eslint-disable-line no-magic-numbers
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
                this.getObject(fileDetails[1]).up().then(response => {   // eslint-disable-line no-magic-numbers
                    Migration.logger(this.dbName).info("%s::up is successful", fileDetails[1]);    // eslint-disable-line no-magic-numbers
                    SchemaInfo.instance(this.dbName, this.accessToken).save(fileDetails[0]).then(success => {   // eslint-disable-line no-magic-numbers
                        Migration.logger(this.dbName).info("saving schema info token %s is successful.", fileDetails[0]);   // eslint-disable-line no-magic-numbers
                        resolve(success);
                    }).catch(error => {
                        Migration.logger(this.dbName).error("saving schema info token %s is failed.", fileDetails[0]);   // eslint-disable-line no-magic-numbers
                        reject(error);
                    });
                }).catch(error => {
                    Migration.logger(this.dbName).error("%s migration failed.", fileDetails[1]);  // eslint-disable-line no-magic-numbers
                    reject(error);
                });
            } catch (error) {
                Migration.logger(this.dbName).error("getObject for %s failed.", fileDetails[1]);   // eslint-disable-line no-magic-numbers
                reject(error);
            }
        });
    }
}
