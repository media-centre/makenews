/* eslint max-nested-callbacks: [2, 7] */
"use strict";

import SchemaInfo from "../../src/migration/SchemaInfo.js";
import HttpResponseHandler from "../../../common/src/HttpResponseHandler.js";
import CouchClient from "../../src/CouchClient.js";
import Migration from "../../src/migration/Migration.js";
import NodeErrorHandler from "../../src/NodeErrorHandler.js";
import ApplicationConfig from "../../src/config/ApplicationConfig.js";

import { assert } from "chai";
import sinon from "sinon";
import nock from "nock";

describe("SchemaInfo", () => {
    let dbName = "test", accessToken = "dmlrcmFtOjU2NzdCREJBOhK9v521YI6LBX32KPdmgNMX9mGt", documentId = "schema_info", document = null;
    let migrationLoggerStub = null;
    before("SchemaInfo", () => {
        let dbUrlStub = sinon.stub(ApplicationConfig, "dbUrl");
        dbUrlStub.returns("http://localhost:5984");
        migrationLoggerStub = sinon.stub(Migration, "logger");
        migrationLoggerStub.withArgs(dbName).returns({
            "error": (message, ...insertions) =>{
            },
            "info": (message, ...insertions)=> {
            },
            "debug": (message, ...insertions)=> {
            }
        });
    });

    after("SchemaInfo", () => {
        ApplicationConfig.dbUrl.restore();
        Migration.logger.restore();
    });

    describe("getSchemaInfo", () => {
        before("getSchemaInfo", () => {
            document = {
                "_id": "schema_info",
                "_rev": "1-74158a09b78fec20a1fa83bfec124032",
                "lastMigratedDocumentTimeStamp": "20151217145510"
            };
        });

        it("should get the schema info", (done)=> {
            nock("http://localhost:5984", {
                "reqheaders": { "Cookie": "AuthSession=" + accessToken, "Accept": "application/json" }
            })
                .get("/" + dbName + "/" + documentId)
                .reply(HttpResponseHandler.codes.OK, document);

            let schemaInfoInstance = new SchemaInfo(dbName, accessToken);
            schemaInfoInstance.getSchemaInfoDocument().then((actualDocument) => {
                assert.deepEqual(document, actualDocument);
                done();
            });

        });

        it("should get the schema info as zero if no schema is found", (done)=> {
            nock("http://localhost:5984", {
                "reqheaders": { "Cookie": "AuthSession=" + accessToken, "Accept": "application/json" }
            })
                .get("/" + dbName + "/" + documentId)
                .reply(HttpResponseHandler.codes.NOT_FOUND);

            let schemaInfoInstance = new SchemaInfo(dbName, accessToken);
            schemaInfoInstance.getSchemaInfoDocument().then((actualDocument) => {
                assert.strictEqual(null, actualDocument);
                done();
            });

        });

        it("should reject with error if the status code is not 200 or 404", (done)=> {
            nock("http://localhost:5984", {
                "reqheaders": { "Cookie": "AuthSession=" + accessToken, "Accept": "application/json" }
            })
                .get("/" + dbName + "/" + documentId)
                .reply(HttpResponseHandler.codes.INTERNAL_SERVER_ERROR, "internal server error");

            let nodeErrorHandlerMock = sinon.mock(NodeErrorHandler).expects("noError");
            nodeErrorHandlerMock.returns(true);

            let schemaInfoInstance = new SchemaInfo(dbName, accessToken);
            schemaInfoInstance.getSchemaInfoDocument().catch((error) => {
                assert.strictEqual("internal server error", error);
                nodeErrorHandlerMock.verify();
                NodeErrorHandler.noError.restore();
                done();
            });

        });

        it("should reject with error if get schema request fails", (done)=> {
            let errorObj = {
                "code": "ECONNREFUSED",
                "errno": "ECONNREFUSED",
                "syscall": "connect",
                "address": "http://localhost:5984",
                "port": 5984
            };
            nock("http://localhost:5984", {
                "reqheaders": { "Cookie": "AuthSession=" + accessToken, "Accept": "application/json" }
            })
                .get("/" + dbName + "/" + documentId)
                .replyWithError(errorObj);

            let schemaInfoInstance = new SchemaInfo(dbName, accessToken);
            schemaInfoInstance.getSchemaInfoDocument().catch((error) => {
                assert.strictEqual("unexpected response from the couchdb", error);
                done();
            });

        });

    });

    describe("save", () => {
        it("should save the schema info document with the given schema version", (done) => {
            let schemaInfoInstance = new SchemaInfo(dbName, accessToken);
            let schemaVersion = "20151217145510";
            let schemaVersionDocument = {
                "lastMigratedDocumentTimeStamp": schemaVersion
            };
            let couchClient = new CouchClient(dbName, accessToken);
            let couchClientInstanceStub = sinon.stub(CouchClient, "instance");
            couchClientInstanceStub.withArgs(dbName, accessToken).returns(couchClient);

            let couchClientSaveDocMock = sinon.mock(couchClient).expects("saveDocument");
            couchClientSaveDocMock.withArgs(documentId, schemaVersionDocument).returns(Promise.resolve({
                "ok": true,
                "id": "schema_info",
                "rev": "1-917fa2381192822767f010b95b45325b"
            }));
            let getSchemaInfoMock = sinon.mock(schemaInfoInstance).expects("getSchemaInfoDocument");
            getSchemaInfoMock.returns(Promise.resolve(null));
            schemaInfoInstance.save(schemaVersion).then(success => {
                assert.isTrue(success);
                couchClientSaveDocMock.verify();
                getSchemaInfoMock.verify();
                couchClient.saveDocument.restore();
                CouchClient.instance.restore();
                schemaInfoInstance.getSchemaInfoDocument.restore();
                done();
            });
        });

        it("should update the schema info document with the given schema version", (done) => {
            let schemaInfoInstance = new SchemaInfo(dbName, accessToken);
            let schemaVersion = "20151218145510";

            let actualDocument = {
                "_id": "schema_info",
                "_rev": "3-1caeea709ad7a00fcb0ca372f03809e0",
                "lastMigratedDocumentTimeStamp": "20151217145511"
            };

            let schemaVersionDocument = {
                "_id": "schema_info",
                "_rev": "3-1caeea709ad7a00fcb0ca372f03809e0",
                "lastMigratedDocumentTimeStamp": schemaVersion
            };
            let couchClient = new CouchClient(dbName, accessToken);
            let couchClientInstanceStub = sinon.stub(CouchClient, "instance");
            couchClientInstanceStub.withArgs(dbName, accessToken).returns(couchClient);

            let couchClientSaveDocMock = sinon.mock(couchClient).expects("saveDocument");
            couchClientSaveDocMock.withArgs(documentId, schemaVersionDocument).returns(Promise.resolve({ "ok": true, "id": "schema_info", "rev": "1-917fa2381192822767f010b95b45325b" }));
            let getSchemaInfoMock = sinon.mock(schemaInfoInstance).expects("getSchemaInfoDocument");
            getSchemaInfoMock.returns(Promise.resolve(actualDocument));

            schemaInfoInstance.save(schemaVersion).then(success => {
                assert.isTrue(success);
                couchClientSaveDocMock.verify();
                getSchemaInfoMock.verify();
                couchClient.saveDocument.restore();
                CouchClient.instance.restore();
                schemaInfoInstance.getSchemaInfoDocument.restore();
                done();
            });
        });
        it("should return false if there is an issue while saving schema info document", (done) => {
            let schemaInfoInstance = new SchemaInfo(dbName, accessToken);
            let schemaVersion = "20151218145510";

            let actualDocument = {
                "_id": "schema_info",
                "_rev": "3-1caeea709ad7a00fcb0ca372f03809e0",
                "lastMigratedDocumentTimeStamp": "20151217145511"
            };

            let schemaVersionDocument = {
                "_id": "schema_info",
                "_rev": "3-1caeea709ad7a00fcb0ca372f03809e0",
                "lastMigratedDocumentTimeStamp": schemaVersion
            };
            let couchClient = new CouchClient(dbName, accessToken);
            let couchClientInstanceStub = sinon.stub(CouchClient, "instance");
            couchClientInstanceStub.withArgs(dbName, accessToken).returns(couchClient);

            let couchClientSaveDocMock = sinon.mock(couchClient).expects("saveDocument");
            couchClientSaveDocMock.withArgs(documentId, schemaVersionDocument).returns(Promise.reject("Error"));
            let getSchemaInfoMock = sinon.mock(schemaInfoInstance).expects("getSchemaInfoDocument");
            getSchemaInfoMock.returns(Promise.resolve(actualDocument));

            schemaInfoInstance.save(schemaVersion).catch(failure => {
                assert.isFalse(failure);
                couchClientSaveDocMock.verify();
                getSchemaInfoMock.verify();
                couchClient.saveDocument.restore();
                CouchClient.instance.restore();
                schemaInfoInstance.getSchemaInfoDocument.restore();
                done();
            });
        });

        it("should return false if there is an issue while fetching schema info document", (done) => {
            let schemaInfoInstance = new SchemaInfo(dbName, accessToken);
            let schemaVersion = "20151218145510";
            let getSchemaInfoMock = sinon.mock(schemaInfoInstance).expects("getSchemaInfoDocument");
            getSchemaInfoMock.returns(Promise.reject("Error"));
            schemaInfoInstance.save(schemaVersion).catch(error => {
                assert.isFalse(error);
                getSchemaInfoMock.verify();
                schemaInfoInstance.getSchemaInfoDocument.restore();
                done();
            });
        });
    });
});
