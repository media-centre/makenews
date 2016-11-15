/* eslint max-nested-callbacks: [2, 7], no-unused-vars:0*/
"use strict";

import CreateCategoryDesignDocument from "../../src/migration/db/20151217145510_CreateCategoryDesignDocument.js";
import CreateDefaultCategoryDocument from "../../src/migration/db/20151217171910_CreateDefaultCategoryDocument.js";
import AddFilterViewsToDesignDocument from "../../src/migration/db/20160205174500_AddFilterViewsToDesignDocument.js";
import URLDocuments from "../../src/migration/db/20161114174315_URLDocument.js";
import Migration from "../../src/migration/Migration.js";
import MigrationFile from "../../src/migration/MigrationFile.js";
import SchemaInfo from "../../src/migration/SchemaInfo.js";
import CouchSession from "../../src/CouchSession.js";
import Logger from "../../src/logging/Logger.js";
import CouchClient from "../../src/CouchClient.js";
import LogTestHelper from "../helpers/LogTestHelper";
import { assert } from "chai";
import sinon from "sinon";

describe("Migration", () => {
    let dbName = null, accessToken = null, accessCookieHeader = null, migrationLoggerStub = null;
    before("Migration", () => {
        dbName = "test";
        accessToken = "dmlrcmFtOjU2NzdCREJBOhK9v521YI6LBX32KPdmgNMX9mGt";
        accessCookieHeader = "AuthSession=dmlrcmFtOjU2NzdCREJBOhK9v521YI6LBX32KPdmgNMX9mGt; Version=1; Path=/; HttpOnly";
        migrationLoggerStub = sinon.stub(Migration, "logger").returns(LogTestHelper.instance());
        let loggerInstanceStub = sinon.stub(Logger, "fileInstance").returns(LogTestHelper.instance());
    });

    after("Migration", () => {
        Migration.logger.restore();
        Logger.fileInstance.restore();
    });


    describe("getObject", () => {
        it("should give the function object to create the instance of create category design document", ()=> {
            let migrationInstance = new Migration(dbName, accessToken);
            let className = "CreateCategoryDesignDocument";
            let object = migrationInstance.getObject(className);
            assert.isTrue(object instanceof CreateCategoryDesignDocument);
        });

        it("should give the function object to create the instance of create default category design document", ()=> {
            let migrationInstance = new Migration(dbName, accessToken);
            let className = "CreateDefaultCategoryDocument";
            let object = migrationInstance.getObject(className);
            assert.isTrue(object instanceof CreateDefaultCategoryDocument);
        });

        it("should give the function object to create the instance of add filter views to design document", () => {
            let migrationInstance = new Migration(dbName, accessToken);
            let className = "AddFilterViewsToDesignDocument";
            let object = migrationInstance.getObject(className);
            assert.isTrue(object instanceof AddFilterViewsToDesignDocument);

        });

        it("should give the function object to create the instance of url document", () => {
            let migrationInstance = new Migration(dbName, accessToken);
            let className ="URLDocuments";
            let object = migrationInstance.getObject(className);
            assert.isTrue(object instanceof URLDocuments);
        });

        it("should throw an error if the class name does not found in case", ()=> {
            let getObjectFn = () => {
                let migrationInstance = new Migration(dbName, accessToken);
                migrationInstance.getObject("DummyCategoryDocument");
            };
            assert.throw(getObjectFn, Error, "class name : DummyCategoryDocument not found");
        });

    });

    describe("start", () => {
        let schemaInfoInstance = null, getSchemaInfoMock = null, schemaInfoInstanceStub = null, schemaVersion = null, migrationFileInstance = null, migrationFileStub = null, getMigratableFileClassNamesMock = null, saveMock = null, migration = null, getObjectMock = null, actualDocument = null; //eslint-disable-line
        beforeEach("start", () => {
            actualDocument = {
                "_id": "schema_info",
                "_rev": "3-1caeea709ad7a00fcb0ca372f03809e0",
                "lastMigratedDocumentTimeStamp": "20151217145511"
            };

            migration = new Migration(dbName, accessToken);
            schemaVersion = "20151217145511";
            schemaInfoInstance = new SchemaInfo(dbName, accessToken);
            schemaInfoInstanceStub = sinon.stub(SchemaInfo, "instance");
            schemaInfoInstanceStub.withArgs(dbName, accessToken).returns(schemaInfoInstance);
            getSchemaInfoMock = sinon.mock(schemaInfoInstance).expects("getSchemaInfoDocument");
            migrationFileInstance = new MigrationFile();
            migrationFileStub = sinon.stub(MigrationFile, "instance");
            migrationFileStub.returns(migrationFileInstance);
            getMigratableFileClassNamesMock = sinon.mock(migrationFileInstance).expects("getMigratableFileClassNames");
            saveMock = sinon.mock(schemaInfoInstance).expects("save");
            getObjectMock = sinon.mock(migration).expects("getObject");
        });

        afterEach("start", () => {
            SchemaInfo.instance.restore();
            schemaInfoInstance.getSchemaInfoDocument.restore();
            MigrationFile.instance.restore();
            migrationFileInstance.getMigratableFileClassNames.restore();
            schemaInfoInstance.save.restore();
            migration.getObject.restore();
        });

        it("should migrate db and save version", (done) => {
            let migratableFileDetails = [["20151218145511", "CreateCategoryDesignDocument"]];

            getSchemaInfoMock.returns(Promise.resolve(actualDocument));
            getMigratableFileClassNamesMock.withArgs(schemaVersion).returns(migratableFileDetails);

            let createCategoryDesignDocument = new CreateCategoryDesignDocument(dbName, accessToken);
            getObjectMock.withArgs(migratableFileDetails[0][1]).returns(createCategoryDesignDocument);

            let createCategoryDesignDocumentUpMock = sinon.mock(createCategoryDesignDocument).expects("up");
            createCategoryDesignDocumentUpMock.returns(Promise.resolve("upResponse"));

            saveMock.withArgs(migratableFileDetails[0][0]).returns(Promise.resolve("saveResponse"));

            migration.start().then(status => {
                assert.isTrue(status);
                getMigratableFileClassNamesMock.verify();
                getSchemaInfoMock.verify();
                getObjectMock.verify();
                saveMock.verify();
                createCategoryDesignDocumentUpMock.verify();
                createCategoryDesignDocument.up.restore();
                done();
            });
        });

        it("should migrate db and save version incase there is no schema version in db yet", (done) => {
            let migratableFileDetails = [["20151218145511", "CreateCategoryDesignDocument"]];

            getSchemaInfoMock.returns(Promise.resolve(null));
            getMigratableFileClassNamesMock.withArgs("19700101000000").returns(migratableFileDetails);

            let createCategoryDesignDocument = new CreateCategoryDesignDocument(dbName, accessToken);
            getObjectMock.withArgs(migratableFileDetails[0][1]).returns(createCategoryDesignDocument);

            let createCategoryDesignDocumentUpMock = sinon.mock(createCategoryDesignDocument).expects("up");
            createCategoryDesignDocumentUpMock.returns(Promise.resolve("upResponse"));

            saveMock.withArgs(migratableFileDetails[0][0]).returns(Promise.resolve("saveResponse"));

            migration.start().then(status => {
                assert.isTrue(status);
                getMigratableFileClassNamesMock.verify();
                getSchemaInfoMock.verify();
                getObjectMock.verify();
                saveMock.verify();
                createCategoryDesignDocumentUpMock.verify();
                createCategoryDesignDocument.up.restore();
                done();
            });
        });

        it("should reject with false if there is any issue while fetching schema_info document", (done) => {
            getSchemaInfoMock.returns(Promise.reject("error"));

            migration.start().catch(error => {
                getSchemaInfoMock.verify();
                done();
            });
        });

        it("should reject with false if there is any issue while fetching schema_info document", (done) => {
            getSchemaInfoMock.returns(Promise.reject("error"));

            migration.start().catch(error => {
                getSchemaInfoMock.verify();
                done();
            });
        });

        it("should stop the migration after the failure", (done) => {

            let migratableFileDetails = [["20151218145511", "CreateCategoryDesignDocument"]];

            getSchemaInfoMock.returns(Promise.resolve(actualDocument));
            getMigratableFileClassNamesMock.withArgs(schemaVersion).returns(migratableFileDetails);

            getObjectMock.withArgs(migratableFileDetails[0][1]).throws("Error");

            migration.start().catch(status => {
                assert.isFalse(status);
                getMigratableFileClassNamesMock.verify();
                getSchemaInfoMock.verify();
                getObjectMock.verify();
                done();
            });
        });

    });

    describe("allDbs", () => {
        let userName = null, password = null;
        before("allDbs", () => {
            userName = "testUserName";
            password = "testPassword";
        });

        it("should migrate all dbs", (done) => {
            let couchSessionLoginMock = sinon.mock(CouchSession).expects("login");
            couchSessionLoginMock.withArgs(userName, password).returns(Promise.resolve(accessCookieHeader));
            let couchClient = new CouchClient(dbName, accessToken);
            sinon.stub(CouchClient, "instance").returns(couchClient);
            let couchClientGetAllDbs = sinon.mock(CouchClient).expects("getAllDbs");
            couchClientGetAllDbs.returns(Promise.resolve(["test1"]));
            let migrationInstanceMock = sinon.mock(Migration).expects("instance");
            let test1Migration = new Migration("test1", accessToken);
            migrationInstanceMock.withArgs("test1", accessToken).returns(test1Migration);
            let test1StartMock = sinon.mock(test1Migration).expects("start");
            test1StartMock.returns(Promise.resolve(true));

            Migration.allDbs(userName, password).then(migrateCount => {
                assert.equal(1, migrateCount[0]);
                migrationInstanceMock.verify();
                test1StartMock.verify();
                couchSessionLoginMock.verify();
                couchClientGetAllDbs.verify();
                Migration.instance.restore();
                test1Migration.start.restore();
                CouchClient.getAllDbs.restore();
                CouchClient.instance.restore();
                CouchSession.login.restore();
                done();
            });
        });
    });
});
