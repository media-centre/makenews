/* eslint max-nested-callbacks: [2, 7] */
"use strict";

import MigrationFile from "../../src/migration/MigrationFile.js";
import fs from "fs";
import sinon from "sinon";

import { assert } from "chai";

describe("MigrationFile", () => {
    let dbName = null, accessToken = null;

    describe("getFile Names", () => {
        it("should get all the migration file names from db folder", () =>{
            let fileName = ["20151217145510_CreateCategoryDesignDocument.js", "20151217171910_CreateDefaultCategoryDocument.js"];
            let fsReadDirSyncMock = sinon.mock(fs).expects("readdirSync");
            fsReadDirSyncMock.withArgs(MigrationFile.MIGRATION_FILES_PATH).returns(fileName);
            let migrationFileInstance = new MigrationFile(dbName, accessToken);
            let actualFileNames = migrationFileInstance.getFileNames();
            assert.equal(fileName, actualFileNames);
            fsReadDirSyncMock.verify();
            fs.readdirSync.restore(); //eslint-disable-line no-sync
        });
        it("should get null if no files available in db folder", () =>{
            let fsReadDirSyncMock = sinon.mock(fs).expects("readdirSync");
            fsReadDirSyncMock.withArgs(MigrationFile.MIGRATION_FILES_PATH).returns(null);
            let migrationFileInstance = new MigrationFile(dbName, accessToken);
            let actualFileNames = migrationFileInstance.getFileNames();
            assert.equal(null, actualFileNames);
            fsReadDirSyncMock.verify();
            fs.readdirSync.restore(); //eslint-disable-line no-sync
        });
    });

    describe("extractVersionAndFileName", () => {
        it("should get version and file name from the given migration file ", () =>{
            let fileName = "20151217145510_CreateCategoryDesignDocument.js";
            let migrationFileInstance = new MigrationFile(dbName, accessToken);
            let extractVersionAndFileName = migrationFileInstance.split(fileName);
            assert.deepEqual(["20151217145510", "CreateCategoryDesignDocument"], extractVersionAndFileName);
        });

        it("should throw an error if the timestamp is not a valid timestamp for the given migration file ", () =>{
            let fileName = "20151317145510_CreateCategoryDesignDocument.js";
            let migrationFileInstanceFn = () => {
                let migrationFileInstance = new MigrationFile(dbName, accessToken);
                migrationFileInstance.split(fileName);
            };
            assert.throw(migrationFileInstanceFn, Error, "invalid timestamp in filename");
        });

        it("should throw an error if the migration file timestamp does not contain 14 digits", () =>{
            let fileName = "2015111115519_CreateCategoryDesignDocument.js";
            let migrationFileInstanceFn = () => {
                let migrationFileInstance = new MigrationFile(dbName, accessToken);
                migrationFileInstance.split(fileName);
            };
            assert.throw(migrationFileInstanceFn, Error, "invalid timestamp in filename");
        });
    });

    describe("getMigratableFileClassNames", () => {
        it("should give the class names of migratable files", () =>{
            let fileNames = ["20151201155503_CreateCategoryDesignDocument.js", "20151201155501_CreateTimeLineDocument.js", "20151201155505_CreateDefaultDocument.js"];
            let schemaInfoTimestamp = "20151201155502";
            let migrationFileInstance = new MigrationFile(dbName, accessToken);
            let migrationFileInstanceStub = sinon.stub(migrationFileInstance, "getFileNames");
            migrationFileInstanceStub.returns(fileNames);
            let migratableClassNames = migrationFileInstance.getMigratableFileClassNames(schemaInfoTimestamp);
            assert.deepEqual([["20151201155503", "CreateCategoryDesignDocument"], ["20151201155505", "CreateDefaultDocument"]], migratableClassNames);
            migrationFileInstance.getFileNames.restore();
        });
    });

});
