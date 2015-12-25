"use strict";
import fs from "fs";
import path from "path";
import moment from "moment";

export default class MigrationFile {
    static instance() {
        return new MigrationFile();
    }
    getMigratableFileClassNames(schemaVersion) {
        let fileNames = this.getFileNames();
        let migratableClasses = [];
        fileNames.forEach((fileName) => {
            let timeStampAndFileName = this.split(fileName);
            if(moment(timeStampAndFileName[0], "YYYYMMDDHHmmss") > moment(schemaVersion, "YYYYMMDDHHmmss")) {
                migratableClasses.push(timeStampAndFileName);
            }
        });
        return migratableClasses;
    }

    getFileNames() {
        try {
            return fs.readdirSync(MigrationFile.MIGRATION_FILES_PATH); //eslint-disable-line no-sync
        } catch(error) {
            return null;
        }
    }

    split(fileName) {
        let timeStamp = this._extractVersion(fileName);
        this._validateTimeStamp(timeStamp);
        return [timeStamp, this._extractFileName(fileName)];
    }

    _extractVersion(fileName) {
        let fileNameAndVersion = fileName.split("_");
        return fileNameAndVersion[0];
    }

    _extractFileName(fileName) {
        let fileNameAndVersion = fileName.split("_");
        let fileNameWithJs = fileNameAndVersion[1].split(".");
        return fileNameWithJs[0];
    }

    _validateTimeStamp(timeStamp) {
        if(timeStamp.length !== MigrationFile.TIMESTAMPFORMATDIGITS || !moment(timeStamp, "YYYYMMDDHHmmss").isValid()) {
            throw new Error("invalid timestamp in filename");
        }
        return true;
    }

}

MigrationFile.MIGRATION_FILES_PATH = path.join(__dirname, "./db");
MigrationFile.TIMESTAMPFORMATDIGITS = 14;
