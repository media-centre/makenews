/* eslint max-nested-callbacks: [2, 7] */


import MigrationFile from "../../src/migration/MigrationFile";
import fs from "fs";
import sinon from "sinon";

import { assert } from "chai";

describe("MigrationFile", () => {

    describe("getFile Names", () => {
        it("should get all the migration file names from db folder", () =>{
            const fileName = ["20161130171020_IndexDocument.js", "20161204171020_FilterDocument.js"];
            const fsReadDirSyncMock = sinon.mock(fs).expects("readdirSync");
            fsReadDirSyncMock.withArgs(MigrationFile.MIGRATION_FILES_PATH).returns(fileName);
            const migrationFileInstance = new MigrationFile();
            const actualFileNames = migrationFileInstance.getFileNames();
            assert.equal(fileName, actualFileNames);
            fsReadDirSyncMock.verify();
            fs.readdirSync.restore(); //eslint-disable-line no-sync
        });
        it("should get all the migration file names from admin folder", () =>{
            const fileName = ["20161114174315_WebURLDocuments.js", "20161118174315_AddIndex.js"];
            const fsReadDirSyncMock = sinon.mock(fs).expects("readdirSync");
            fsReadDirSyncMock.withArgs(MigrationFile.ADMIN_MIGRATION_FILES_PATH).returns(fileName);
            const migrationFileInstance = new MigrationFile();
            const actualFileNames = migrationFileInstance.getFileNames(MigrationFile.ADMIN_MIGRATION_FILES_PATH);
            assert.equal(fileName, actualFileNames);
            fsReadDirSyncMock.verify();
            fs.readdirSync.restore(); //eslint-disable-line no-sync
        });
        it("should get null if no files available in db folder", () =>{
            const fsReadDirSyncMock = sinon.mock(fs).expects("readdirSync");
            fsReadDirSyncMock.withArgs(MigrationFile.MIGRATION_FILES_PATH).returns(null);
            const migrationFileInstance = new MigrationFile();
            const actualFileNames = migrationFileInstance.getFileNames();
            assert.equal(null, actualFileNames);
            fsReadDirSyncMock.verify();
            fs.readdirSync.restore(); //eslint-disable-line no-sync
        });
    });

    describe("extractVersionAndFileName", () => {
        it("should get version and file name from the given migration file ", () =>{
            const fileName = "20151217145510_CreateCategoryDesignDocument.js";
            const migrationFileInstance = new MigrationFile();
            const extractVersionAndFileName = migrationFileInstance.split(fileName);
            assert.deepEqual(["20151217145510", "CreateCategoryDesignDocument"], extractVersionAndFileName);
        });

        it("should throw an error if the timestamp is not a valid timestamp for the given migration file ", () =>{
            const fileName = "20151317145510_CreateCategoryDesignDocument.js";
            const migrationFileInstanceFn = () => {
                const migrationFileInstance = new MigrationFile();
                migrationFileInstance.split(fileName);
            };
            assert.throw(migrationFileInstanceFn, Error, "invalid timestamp in filename");
        });

        it("should throw an error if the migration file timestamp does not contain 14 digits", () =>{
            const fileName = "2015111115519_CreateCategoryDesignDocument.js";
            const migrationFileInstanceFn = () => {
                const migrationFileInstance = new MigrationFile();
                migrationFileInstance.split(fileName);
            };
            assert.throw(migrationFileInstanceFn, Error, "invalid timestamp in filename");
        });
    });

    describe("getMigratableFileClassNames", () => {
        it("should give the class names of migratable files", () =>{
            const fileNames = ["20161130171020_IndexDocument.js", "20161204171020_FilterDocument.js"];
            const schemaInfoTimestamp = "20161130171010";
            const migrationFileInstance = new MigrationFile();
            const migrationFileInstanceStub = sinon.stub(migrationFileInstance, "getFileNames").withArgs(MigrationFile.MIGRATION_FILES_PATH);
            migrationFileInstanceStub.returns(fileNames);
            const migratableClassNames = migrationFileInstance.getMigratableFileClassNames(schemaInfoTimestamp);
            assert.deepEqual(migratableClassNames, [["20161130171020", "IndexDocument"], ["20161204171020", "FilterDocument"]]);
            migrationFileInstance.getFileNames.restore();
        });

        it("should give the class names of admin migratable files", () =>{
            const fileNames = ["20161114174315_WebURLDocuments.js", "20161118174315_AddIndex.js"];
            const schemaInfoTimestamp = "20161114174310";
            const migrationFileInstance = new MigrationFile(true);
            const migrationFileInstanceStub = sinon.stub(migrationFileInstance, "getFileNames").withArgs(MigrationFile.ADMIN_MIGRATION_FILES_PATH);
            migrationFileInstanceStub.returns(fileNames);
            const migratableClassNames = migrationFileInstance.getMigratableFileClassNames(schemaInfoTimestamp);
            assert.deepEqual(migratableClassNames, [["20161114174315", "WebURLDocuments"], ["20161118174315", "AddIndex"]]);
            migrationFileInstance.getFileNames.restore();
        });
    });

});
