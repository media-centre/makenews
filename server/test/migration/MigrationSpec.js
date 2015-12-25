/* eslint max-nested-callbacks: [2, 7] */
"use strict";

import CreateCategoryDesignDocument from "../../src/migration/db/20151217145510_CreateCategoryDesignDocument.js";
import CreateDefaultCategoryDocument from "../../src/migration/db/20151217171910_CreateDefaultCategoryDocument.js";
import Migration from "../../src/migration/Migration.js";
import MigrationFile from "../../src/migration/MigrationFile.js";
import SchemaInfo from "../../src/migration/SchemaInfo.js";
import { assert } from "chai";
import sinon from "sinon";

describe("Migration", () => {
    let dbName = null, accessToken = null;
    before("getObject", () => {
        dbName = "test";
        accessToken = "dmlrcmFtOjU2NzdCREJBOhK9v521YI6LBX32KPdmgNMX9mGt";
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
    });
    describe("start", () => {
        it("should migrate db and save version", (done) => {

            let actualDocument = {
                "_id": "schema_info",
                "_rev": "3-1caeea709ad7a00fcb0ca372f03809e0",
                "lastMigratedDocumentTimeStamp": "20151217145511"
            };
            let schemaVersion = "20151217145511";
            let migratableFileDetails = [["20151218145511", "CreateCategoryDesignDocument"]];

            let migration = new Migration(dbName, accessToken);

            let migrationFileInstance = new MigrationFile();
            let migrationFileStub = sinon.stub(MigrationFile, "instance");
            migrationFileStub.returns(migrationFileInstance);

            let getMigratableFileClassNamesMock = sinon.mock(migrationFileInstance).expects("getMigratableFileClassNames");
            getMigratableFileClassNamesMock.withArgs(schemaVersion).returns(migratableFileDetails);

            let schemaInfoInstance = new SchemaInfo(dbName, accessToken);
            let schemaInfoInstanceStub = sinon.stub(SchemaInfo, "instance");
            schemaInfoInstanceStub.withArgs(dbName, accessToken).returns(schemaInfoInstance);

            let getSchemaInfoMock = sinon.mock(schemaInfoInstance).expects("getSchemaInfoDocument");
            getSchemaInfoMock.returns(Promise.resolve(actualDocument));

            let saveMock = sinon.mock(schemaInfoInstance).expects("save");
            saveMock.withArgs(migratableFileDetails[0][0]);
            let createCategoryDesignDocument = new CreateCategoryDesignDocument(dbName, accessToken);

            let getObjectMock = sinon.mock(migration).expects("getObject");
            getObjectMock.withArgs(migratableFileDetails[0][1]).returns(createCategoryDesignDocument);

            let createCategoryDesignDocumentUpMock = sinon.mock(createCategoryDesignDocument).expects("up");
            createCategoryDesignDocumentUpMock.returns(Promise.resolve("response"));

            migration.start().then(status => {
                assert.isTrue(status);
                getMigratableFileClassNamesMock.verify();
                getSchemaInfoMock.verify();
                getObjectMock.verify();
                saveMock.verify();
                createCategoryDesignDocumentUpMock.verify();
                MigrationFile.instance.restore();
                SchemaInfo.instance.restore();
                createCategoryDesignDocument.up.restore();
                schemaInfoInstance.getSchemaInfoDocument.restore();
                migrationFileInstance.getMigratableFileClassNames.restore();
                schemaInfoInstance.save.restore();
                migration.getObject.restore();
                done();
            });
        });
    });
});
