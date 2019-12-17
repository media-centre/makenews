import fs from "fs";
import path from "path";
import moment from "moment";

export default class MigrationFile {
    constructor(isAdmin = false) {
        this.isAdmin = isAdmin;
    }

    static instance(isAdmin) {
        return new MigrationFile(isAdmin);
    }
    getMigratableFileClassNames(schemaVersion) {

        const migrationPath = this.isAdmin ? MigrationFile.ADMIN_MIGRATION_FILES_PATH : MigrationFile.MIGRATION_FILES_PATH;
        const fileNames = this.getFileNames(migrationPath);
        const migratableClasses = [];
        fileNames.forEach((fileName) => {
            const timeStampAndFileName = this.split(fileName);
            if(moment(timeStampAndFileName[0], "YYYYMMDDHHmmss") > moment(schemaVersion, "YYYYMMDDHHmmss")) { // eslint-disable-line no-magic-numbers
                migratableClasses.push(timeStampAndFileName);
            }
        });
        return migratableClasses;
    }

    getFileNames(filePath = MigrationFile.MIGRATION_FILES_PATH) {
        try {
            return fs.readdirSync(filePath); //eslint-disable-line no-sync
        } catch(error) {
            return null;
        }
    }

    split(fileName) {
        const timeStamp = this._extractVersion(fileName);
        this._validateTimeStamp(timeStamp);
        return [timeStamp, this._extractFileName(fileName)];
    }

    _extractVersion(fileName) {
        const fileNameAndVersion = fileName.split("_");
        return fileNameAndVersion[0]; // eslint-disable-line no-magic-numbers
    }

    _extractFileName(fileName) {
        const fileNameAndVersion = fileName.split("_");
        const fileNameWithJs = fileNameAndVersion[1].split("."); // eslint-disable-line no-magic-numbers
        return fileNameWithJs[0]; // eslint-disable-line no-magic-numbers
    }

    _validateTimeStamp(timeStamp) {
        if(timeStamp.length !== MigrationFile.TIMESTAMPFORMATDIGITS || !moment(timeStamp, "YYYYMMDDHHmmss").isValid()) {
            throw new Error("invalid timestamp in filename");
        }
        return true;
    }

}

MigrationFile.MIGRATION_FILES_PATH = path.join(__dirname, "./db");
MigrationFile.ADMIN_MIGRATION_FILES_PATH = path.join(__dirname, "./admin");
MigrationFile.TIMESTAMPFORMATDIGITS = 14;
