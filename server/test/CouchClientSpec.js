/* eslint max-nested-callbacks: [2, 7] */
import CouchClient from "../src/CouchClient";
import NodeErrorHandler from "../src/NodeErrorHandler";
import HttpResponseHandler from "../../common/src/HttpResponseHandler";
import ApplicationConfig from "../src/config/ApplicationConfig";
import LogTestHelper from "./helpers/LogTestHelper";
import sinon from "sinon";

import { assert } from "chai";
import nock from "nock";

describe("CouchClient", () => {
    let applicationConfig = null, dbName = "test", accessToken = "dmlrcmFtOjU2NzdCREJBOhK9v521YI6LBX32KPdmgNMX9mGt", documentId = "schema_info", response = null;
    before("CouchClient", () => {
        applicationConfig = new ApplicationConfig();
        sinon.stub(ApplicationConfig, "instance").returns(applicationConfig);
        sinon.stub(applicationConfig, "dbUrl").returns("http://localhost:5984");
        sinon.stub(CouchClient, "logger").returns(LogTestHelper.instance());
    });

    after("CouchClient", () => {
        ApplicationConfig.instance.restore();
        applicationConfig.dbUrl.restore();
        CouchClient.logger.restore();
    });

    describe("findDocuments", () => {
        before("findDocuments", () => {
            response = {
                "docs": [
                    {
                        "_id": "15419e8f2569b9da4b1507dab0008d20",
                        "_rev": "2-acd8f3948c6e42e6231da99d499d9fba",
                        "docType": "source",
                        "sourceType": "web",
                        "name": "The Hindu - Home",
                        "url": "http://www.thehindu.com/?service=rss"
                    },
                    {
                        "_id": "15419e8f2569b9da4b1507dab00126fb",
                        "_rev": "2-98b612c34a507c1d959fbab4de313ac6",
                        "docType": "source",
                        "sourceType": "web",
                        "name": "The Hindu - Sci-Tech",
                        "url": "http://www.thehindu.com/sci-tech/?service=rss"
                    }
                ]
            };
        });

        it("should return all documents with name matching the search key", (done) => {
            let searchKey = "Hindu";
            let body = { "selector": { "_id": { "$gt": null }, "name": { "$regex": searchKey }, "url": { "$gt": null } } };
            nock("http://localhost:5984", {
                "reqheaders": {
                    "Cookie": "AuthSession=" + accessToken,
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                }
            })
                .post("/" + dbName + "/_find")
                .reply(HttpResponseHandler.codes.OK, response);

            let nodeErrorHandlerMock = sinon.mock(NodeErrorHandler).expects("noError");
            nodeErrorHandlerMock.returns(true);
            let couchClientInstance = new CouchClient(accessToken, dbName);
            couchClientInstance.findDocuments(body).then((actualResponse) => {
                assert.deepEqual(response, actualResponse);
                nodeErrorHandlerMock.verify();
                NodeErrorHandler.noError.restore();
                done();
            });
        });
    });

    describe("createIndex", () => {
        it("should return response for createIndex", (done) => {
            let indexDoc = {
                "index": {
                    "fields": ["name", "id"]
                },
                "name": "name-id"
            };

            nock("http://localhost:5984", {
                "reqheaders": {
                    "Cookie": "AuthSession=" + accessToken,
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                }
            })
              .post("/" + dbName + "/_index")
              .reply(HttpResponseHandler.codes.OK, response);

            let nodeErrorHandlerMock = sinon.mock(NodeErrorHandler).expects("noError");
            nodeErrorHandlerMock.returns(true);
            let couchClientInstance = new CouchClient(accessToken, dbName);
            couchClientInstance.createIndex(indexDoc).then((actualResponse) => {
                assert.deepEqual(actualResponse, response);
                nodeErrorHandlerMock.verify();
                NodeErrorHandler.noError.restore();
                done();
            });
        });
        
    });

    describe("saveDocument", () => {

        before("saveDocument", () => {
            response = { "ok": true, "id": "schema_info", "rev": "1-917fa2381192822767f010b95b45325b" };
        });

        it("should save the document with the given id", (done) => {
            let documentObj = { "lastMigratedTimeStamp": "20151217145510" };

            nock("http://localhost:5984", {
                "reqheaders": {
                    "Cookie": "AuthSession=" + accessToken,
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                }
            })
                .put("/" + dbName + "/schema_info", documentObj)
                .reply(HttpResponseHandler.codes.OK, response);

            let nodeErrorHandlerMock = sinon.mock(NodeErrorHandler).expects("noError");
            nodeErrorHandlerMock.returns(true);
            let couchClientInstance = new CouchClient(accessToken, dbName);
            couchClientInstance.saveDocument(documentId, documentObj).then((actualResponse) => {
                assert.deepEqual(response, actualResponse);
                nodeErrorHandlerMock.verify();
                NodeErrorHandler.noError.restore();
                done();
            });
        });

        it("should save the document with the given id and extra headers", (done) => {
            let documentObj = { "lastMigratedTimeStamp": "20151217145510" };
            let headers = { "If-Match": "12345" };

            nock("http://localhost:5984", {
                "reqheaders": {
                    "Cookie": "AuthSession=" + accessToken,
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    "If-Match": "12345"
                }
            })
                .put("/" + dbName + "/schema_info", documentObj)
                .reply(HttpResponseHandler.codes.OK, response);

            let nodeErrorHandlerMock = sinon.mock(NodeErrorHandler).expects("noError");
            nodeErrorHandlerMock.returns(true);
            let couchClientInstance = new CouchClient(accessToken, dbName);
            couchClientInstance.saveDocument(documentId, documentObj, headers).then((actualResponse) => {
                assert.deepEqual(response, actualResponse);
                nodeErrorHandlerMock.verify();
                NodeErrorHandler.noError.restore();
                done();
            });
        });

        it("should reject with error if there is any error", (done) => {
            let documentObj = { "lastMigratedTimeStamp": "20151217145510" };

            nock("http://localhost:5984", {
                "reqheaders": {
                    "Cookie": "AuthSession=" + accessToken,
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                }
            })
                .put("/" + dbName + "/schema_info", documentObj)
                .replyWithError({
                    "code": "ECONNREFUSED",
                    "errno": "ECONNREFUSED",
                    "syscall": "connect",
                    "address": "127.0.0.1",
                    "port": 5984
                });

            let nodeErrorHandlerMock = sinon.mock(NodeErrorHandler).expects("noError");
            nodeErrorHandlerMock.returns(false);
            let couchClientInstance = new CouchClient(accessToken, dbName);
            couchClientInstance.saveDocument(documentId, documentObj).catch((error) => {
                assert.strictEqual("ECONNREFUSED", error.code);
                nodeErrorHandlerMock.verify();
                NodeErrorHandler.noError.restore();
                done();
            });
        });

        it("should reject with error if the response code is not 200", (done) => {
            let documentObj = { "lastMigratedTimeStamp": "20151217145510" };
            nock("http://localhost:5984", {
                "reqheaders": {
                    "Cookie": "AuthSession=" + accessToken,
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                }
            })
                .put("/" + dbName + "/schema_info", documentObj)
                .reply(HttpResponseHandler.codes.NOT_FOUND, "unexpected response from the db");

            let nodeErrorHandlerMock = sinon.mock(NodeErrorHandler).expects("noError");
            nodeErrorHandlerMock.returns(true);
            let couchClientInstance = new CouchClient(accessToken, dbName);
            couchClientInstance.saveDocument(documentId, documentObj).catch((error) => {
                assert.strictEqual("unexpected response from the db", error);
                nodeErrorHandlerMock.verify();
                NodeErrorHandler.noError.restore();
                done();
            });
        });

        it("should return message if response code is conflict", (done) => {
            let result = { "status": "conflict", "message": "document already exist" };
            let documentObj = { "lastMigratedTimeStamp": "20151217145510" };
            nock("http://localhost:5984", {
                "reqheaders": {
                    "Cookie": "AuthSession=" + accessToken,
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                }
            })
                .put("/" + dbName + "/schema_info", documentObj)
                .reply(HttpResponseHandler.codes.CONFLICT, result);

            let nodeErrorHandlerMock = sinon.mock(NodeErrorHandler).expects("noError");
            nodeErrorHandlerMock.returns(true);
            let couchClientInstance = new CouchClient(accessToken, dbName);
            couchClientInstance.saveDocument(documentId, documentObj).catch((error) => {
                assert.strictEqual("conflict", error.status);
                nodeErrorHandlerMock.verify();
                NodeErrorHandler.noError.restore();
                done();
            });
        });

    });

    describe("getDocument", () => {

        it("should get the document with the success status code", (done) => {
            let docId = "123456";
            let documentObj = { "_id": docId, "test": "abcd" };

            nock("http://localhost:5984", {
                "reqheaders": {
                    "Cookie": "AuthSession=" + accessToken,
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                }
            })
                .get("/" + dbName + "/" + docId)
                .reply(HttpResponseHandler.codes.OK, documentObj);

            let nodeErrorHandlerMock = sinon.mock(NodeErrorHandler).expects("noError");
            nodeErrorHandlerMock.returns(true);
            let couchClientInstance = new CouchClient(accessToken, dbName);
            couchClientInstance.getDocument(docId).then((actualResponse) => {
                assert.deepEqual(actualResponse, documentObj);
                nodeErrorHandlerMock.verify();
                NodeErrorHandler.noError.restore();
                done();
            });
        });

        it("should get the document with custom headers", (done) => {
            let docId = "123456";
            let documentObj = { "_id": docId, "test": "abcd" };
            let headers = { "If-Match": "12345" };

            nock("http://localhost:5984", {
                "reqheaders": {
                    "Cookie": "AuthSession=" + accessToken,
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    "If-Match": "12345"
                }
            })
                .get("/" + dbName + "/" + docId)
                .reply(HttpResponseHandler.codes.OK, documentObj);

            let nodeErrorHandlerMock = sinon.mock(NodeErrorHandler).expects("noError");
            nodeErrorHandlerMock.returns(true);
            let couchClientInstance = new CouchClient(accessToken, dbName);
            couchClientInstance.getDocument(docId, headers).then((actualResponse) => {
                assert.deepEqual(actualResponse, documentObj);
                nodeErrorHandlerMock.verify();
                NodeErrorHandler.noError.restore();
                done();
            });
        });

        it("should reject with error if couchdb returns status not success", (done) => {
            let docId = "123456";

            nock("http://localhost:5984", {
                "reqheaders": {
                    "Cookie": "AuthSession=" + accessToken,
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                }
            })
                .get("/" + dbName + "/" + docId)
                .reply(HttpResponseHandler.codes.NOT_FOUND, "");

            let nodeErrorHandlerMock = sinon.mock(NodeErrorHandler).expects("noError");
            nodeErrorHandlerMock.returns(true);
            let couchClientInstance = new CouchClient(accessToken, dbName);
            couchClientInstance.getDocument(docId).catch((error) => {
                assert.strictEqual(error, "unexpected response from the db");
                nodeErrorHandlerMock.verify();
                NodeErrorHandler.noError.restore();
                done();
            });
        });

        it("should reject with error if couchdb returns error", (done) => {
            let docId = "123456";

            nock("http://localhost:5984", {
                "reqheaders": {
                    "Cookie": "AuthSession=" + accessToken,
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                }
            })
                .get("/" + dbName + "/" + docId)
                .replyWithError("error message");

            let nodeErrorHandlerMock = sinon.mock(NodeErrorHandler).expects("noError");
            nodeErrorHandlerMock.returns(false);
            let couchClientInstance = new CouchClient(accessToken, dbName);
            couchClientInstance.getDocument(docId).catch((error) => {
                assert.deepEqual(error, new Error("error message"));
                nodeErrorHandlerMock.verify();
                NodeErrorHandler.noError.restore();
                done();
            });
        });

    });

    describe("getAllDbs", () => {
        it("should get all db names in a couch db", (done) => {
            nock("http://localhost:5984")
                .get("/_all_dbs")
                .reply(HttpResponseHandler.codes.OK, ["_replicator", "_users", "test1", "test2", "test3"]);

            CouchClient.getAllDbs().then(dbs => {
                assert.deepEqual(["test1", "test2", "test3"], dbs);
                done();
            });
        });
    });

});

