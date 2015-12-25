/*eslint no-unused-vars:0*/
"use strict";
import CreateCategoryDesignDocument from "../../src/migration/db/20151217145510_CreateCategoryDesignDocument.js";
import CreateDefaultCategoryDocument from "../../src/migration/db/20151217171910_CreateDefaultCategoryDocument.js";
import SchemaInfo from "./SchemaInfo.js";
import MigrationFile from "./MigrationFile.js";

export default class Migration {
    static instance(dbName, accessToken) {
        return new Migration(dbName, accessToken);
    }

    constructor(dbName, accessToken) {
        this.dbName = dbName;
        this.accessToken = accessToken;
    }

    start() {
        return new Promise((resolve, reject) => {
            SchemaInfo.instance(this.dbName, this.accessToken).getSchemaInfoDocument().then(schemaInfoDoc => {
                let migratableFileDetails = MigrationFile.instance().getMigratableFileClassNames(schemaInfoDoc.lastMigratedDocumentTimeStamp);
                migratableFileDetails.forEach((fileDetails) => {
                    this._migrateFile(fileDetails);
                });
                resolve(true);
            }).catch(error =>{
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
            return null;
        }
    }

    _migrateFile(fileDetails) {
        return new Promise((resolve, reject) => {
            this.getObject(fileDetails[1]).up().then(response => {
                SchemaInfo.instance(this.dbName, this.accessToken).save(fileDetails[0]).then(success => {
                    resolve(success);
                });
            });
        });
    }
}
