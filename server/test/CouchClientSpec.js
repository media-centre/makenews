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
    let applicationConfig = null;
    const dbName = "test";
    const accessToken = "dmlrcmFtOjU2NzdCREJBOhK9v521YI6LBX32KPdmgNMX9mGt";
    const documentId = "schema_info";
    let response = null;
    let sandbox = null;
    beforeEach("CouchClient", () => {
        sandbox = sinon.sandbox.create();
        applicationConfig = new ApplicationConfig();
        sandbox.stub(ApplicationConfig, "instance").returns(applicationConfig);
        sandbox.stub(applicationConfig, "dbUrl").returns("http://localhost:5984");
        sandbox.stub(CouchClient, "logger").returns(LogTestHelper.instance());
    });

    afterEach("CouchClient", () => {
        sandbox.restore();
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
            const searchKey = "Hindu";
            const body = { "selector": { "_id": { "$gt": null }, "name": { "$regex": searchKey }, "url": { "$gt": null } } };
            nock("http://localhost:5984", {
                "reqheaders": {
                    "Cookie": "AuthSession=" + accessToken,
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                }
            })
                .post("/" + dbName + "/_find")
                .reply(HttpResponseHandler.codes.OK, response);

            const nodeErrorHandlerMock = sandbox.mock(NodeErrorHandler).expects("noError");
            nodeErrorHandlerMock.returns(true);
            const couchClientInstance = new CouchClient(accessToken, dbName);
            couchClientInstance.findDocuments(body).then((actualResponse) => {
                assert.deepEqual(response, actualResponse);
                nodeErrorHandlerMock.verify();
                done();
            });
        });

        it("should throw an error if there is no matching index for the selector field", async() => {
            const query = {
                "selector": {
                    "sourceId": {
                        "$gt": null
                    }
                }
            };

            const warnResponse = {
                "warning": "no matching index found, create an index to optimize query time",
                "docs": []
            };
            nock("http://localhost:5984", {
                "reqheaders": {
                    "Cookie": "AuthSession=" + accessToken,
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                }
            })
                .post("/" + dbName + "/_find")
                .reply(HttpResponseHandler.codes.OK, warnResponse);

            const couchClientInstance = new CouchClient(accessToken, dbName);
            try {
                await couchClientInstance.findDocuments(query);
            } catch (err) {
                assert.deepEqual("No matching index found", err.message);
            }

        });
    });

    describe("createIndex", () => {
        it("should return response for createIndex", (done) => {
            const indexDoc = {
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

            const nodeErrorHandlerMock = sandbox.mock(NodeErrorHandler).expects("noError");
            nodeErrorHandlerMock.returns(true);
            const couchClientInstance = new CouchClient(accessToken, dbName);
            couchClientInstance.createIndex(indexDoc).then((actualResponse) => {
                assert.deepEqual(actualResponse, response);
                nodeErrorHandlerMock.verify();
                done();
            });
        });
    });

    describe("saveDocument", () => {

        before("saveDocument", () => {
            response = { "ok": true, "id": "schema_info", "rev": "1-917fa2381192822767f010b95b45325b" };
        });

        it("should save the document with the given id", (done) => {
            const documentObj = { "lastMigratedTimeStamp": "20151217145510" };

            nock("http://localhost:5984", {
                "reqheaders": {
                    "Cookie": "AuthSession=" + accessToken,
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                }
            })
                .put("/" + dbName + "/schema_info", documentObj)
                .reply(HttpResponseHandler.codes.OK, response);

            const nodeErrorHandlerMock = sandbox.mock(NodeErrorHandler).expects("noError");
            nodeErrorHandlerMock.returns(true);
            const couchClientInstance = new CouchClient(accessToken, dbName);
            couchClientInstance.saveDocument(documentId, documentObj).then((actualResponse) => {
                assert.deepEqual(response, actualResponse);
                nodeErrorHandlerMock.verify();
                done();
            });
        });

        it("should save the document with the given id and extra headers", (done) => {
            const documentObj = { "lastMigratedTimeStamp": "20151217145510" };
            const headers = { "If-Match": "12345" };

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

            const nodeErrorHandlerMock = sandbox.mock(NodeErrorHandler).expects("noError");
            nodeErrorHandlerMock.returns(true);
            const couchClientInstance = new CouchClient(accessToken, dbName);
            couchClientInstance.saveDocument(documentId, documentObj, headers).then((actualResponse) => {
                assert.deepEqual(response, actualResponse);
                nodeErrorHandlerMock.verify();
                done();
            });
        });

        it("should reject with error if there is any error", (done) => {
            const documentObj = { "lastMigratedTimeStamp": "20151217145510" };

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

            const nodeErrorHandlerMock = sandbox.mock(NodeErrorHandler).expects("noError");
            nodeErrorHandlerMock.returns(false);
            const couchClientInstance = new CouchClient(accessToken, dbName);
            couchClientInstance.saveDocument(documentId, documentObj).catch((error) => {
                assert.strictEqual("ECONNREFUSED", error.code);
                nodeErrorHandlerMock.verify();
                done();
            });
        });

        it("should reject with error if the response code is not 200", (done) => {
            const documentObj = { "lastMigratedTimeStamp": "20151217145510" };
            nock("http://localhost:5984", {
                "reqheaders": {
                    "Cookie": "AuthSession=" + accessToken,
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                }
            })
                .put("/" + dbName + "/schema_info", documentObj)
                .reply(HttpResponseHandler.codes.NOT_FOUND, { "message": "not found" });

            const nodeErrorHandlerMock = sandbox.mock(NodeErrorHandler).expects("noError");
            nodeErrorHandlerMock.returns(true);
            const couchClientInstance = new CouchClient(accessToken, dbName);
            couchClientInstance.saveDocument(documentId, documentObj).catch((error) => {
                assert.deepEqual({ "status": HttpResponseHandler.codes.NOT_FOUND, "message": { "message": "not found" } }, error);
                nodeErrorHandlerMock.verify();
                done();
            });
        });
    });

    describe("deleteBulkDocuments", () => {
        it("should delete the bulk docs", () => {
            const docs = [{ "_id": 1 }, { "_id": 2 }];
            const docsToDelete = [
                { "_id": 1, "_deleted": true },
                { "_id": 2, "_deleted": true }
            ];

            const couchClientInstance = new CouchClient(accessToken, dbName);
            const postMock = sandbox.mock(couchClientInstance).expects("saveBulkDocuments");
            postMock.withExactArgs({ "docs": docsToDelete }).returns(Promise.resolve());

            couchClientInstance.deleteBulkDocuments(docs);

            postMock.verify();
        });
    });

    describe("getDocument", () => {

        it("should get the document with the success status code", (done) => {
            const docId = "123456";
            const documentObj = { "_id": docId, "test": "abcd" };

            nock("http://localhost:5984", {
                "reqheaders": {
                    "Cookie": "AuthSession=" + accessToken,
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                }
            })
                .get("/" + dbName + "/" + docId)
                .reply(HttpResponseHandler.codes.OK, documentObj);

            const nodeErrorHandlerMock = sandbox.mock(NodeErrorHandler).expects("noError");
            nodeErrorHandlerMock.returns(true);
            const couchClientInstance = new CouchClient(accessToken, dbName);
            couchClientInstance.getDocument(docId).then((actualResponse) => {
                assert.deepEqual(actualResponse, documentObj);
                nodeErrorHandlerMock.verify();
                done();
            });
        });

        it("should get the document with custom headers", (done) => {
            const docId = "123456";
            const documentObj = { "_id": docId, "test": "abcd" };
            const headers = { "If-Match": "12345" };

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

            const nodeErrorHandlerMock = sandbox.mock(NodeErrorHandler).expects("noError");
            nodeErrorHandlerMock.returns(true);
            const couchClientInstance = new CouchClient(accessToken, dbName);
            couchClientInstance.getDocument(docId, headers).then((actualResponse) => {
                assert.deepEqual(actualResponse, documentObj);
                nodeErrorHandlerMock.verify();
                done();
            });
        });

        it("should reject with error if couchdb returns status not success", (done) => {
            const docId = "123456";

            nock("http://localhost:5984", {
                "reqheaders": {
                    "Cookie": "AuthSession=" + accessToken,
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                }
            })
                .get("/" + dbName + "/" + docId)
                .reply(HttpResponseHandler.codes.NOT_FOUND, { "error": "not found" });

            const nodeErrorHandlerMock = sandbox.mock(NodeErrorHandler).expects("noError");
            nodeErrorHandlerMock.returns(true);
            const couchClientInstance = new CouchClient(accessToken, dbName);
            couchClientInstance.getDocument(docId).catch((error) => {
                assert.deepEqual(error, { "status": HttpResponseHandler.codes.NOT_FOUND, "message": { "error": "not found" } });
                nodeErrorHandlerMock.verify();
                done();
            });
        });

        it("should reject with error if couchdb returns error", () => {
            const docId = "123456";

            nock("http://localhost:5984", {
                "reqheaders": {
                    "Cookie": "AuthSession=" + accessToken,
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                }
            })
                .get("/" + dbName + "/" + docId)
                .replyWithError("error message");

            const nodeErrorHandlerMock = sandbox.mock(NodeErrorHandler).expects("noError");
            nodeErrorHandlerMock.returns(false);
            const couchClientInstance = new CouchClient(accessToken, dbName);
            return couchClientInstance.getDocument(docId).catch((error) => {
                assert.equal(error.message, "error message");
                nodeErrorHandlerMock.verify();
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

    describe("updateDocument", () => {
        it("should create the document with the given document", (done) => {
            const documentObject = {
                "title": "title",
                "description": "description"
            };

            nock("http://localhost:5984", {
                "reqheaders": {
                    "Cookie": "AuthSession=" + accessToken,
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                }
            })
                .post("/" + dbName, documentObject)
                .reply(HttpResponseHandler.codes.OK, response);

            const nodeErrorHandlerMock = sandbox.mock(NodeErrorHandler).expects("noError");
            nodeErrorHandlerMock.returns(true);
            const couchClientInstance = new CouchClient(accessToken, dbName);
            couchClientInstance.updateDocument(documentObject).then((actualResponse) => {
                assert.deepEqual(response, actualResponse);
                nodeErrorHandlerMock.verify();
                done();
            });
        });


        it("should reject with error if there is any error", (done) => {
            const documentObject = {
                "title": "title",
                "description": "description"
            };

            nock("http://localhost:5984", {
                "reqheaders": {
                    "Cookie": "AuthSession=" + accessToken,
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                }
            })
                .post("/" + dbName, documentObject)
                .replyWithError({
                    "code": "ECONNREFUSED",
                    "errno": "ECONNREFUSED",
                    "syscall": "connect",
                    "address": "127.0.0.1",
                    "port": 5984
                });

            const nodeErrorHandlerMock = sandbox.mock(NodeErrorHandler).expects("noError");
            nodeErrorHandlerMock.returns(false);
            const couchClientInstance = new CouchClient(accessToken, dbName);
            couchClientInstance.updateDocument(documentObject).catch((error) => {
                assert.strictEqual("ECONNREFUSED", error.code);
                nodeErrorHandlerMock.verify();
                done();
            });
        });
    });

    describe("deleteDocument", () => {
        const docId = "123";
        const revision = "1";
        it("should delete document", async() => {
            nock("http://localhost:5984", {
                "reqheaders": {
                    "Cookie": "AuthSession=" + accessToken,
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                }
            })
                .delete(`/${dbName}/${docId}?rev=${revision}`)
                .reply(HttpResponseHandler.codes.OK, response);

            const couchClientInstance = new CouchClient(accessToken, dbName);
            await couchClientInstance.deleteDocument(docId, revision);
        });

        it("should get revision and then delete document if revision not passed", async() => {
            nock("http://localhost:5984", {
                "reqheaders": {
                    "Cookie": "AuthSession=" + accessToken,
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                }
            })
                .delete(`/${dbName}/${docId}?rev=${revision}`)
                .reply(HttpResponseHandler.codes.OK, response);

            nock("http://localhost:5984", {
                "reqheaders": {
                    "Cookie": "AuthSession=" + accessToken,
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                }
            })
                .get(`/${dbName}/${docId}`)
                .reply(HttpResponseHandler.codes.OK, { "_rev": revision });

            const couchClientInstance = new CouchClient(accessToken, dbName);
            await couchClientInstance.deleteDocument(docId);
        });

        it("should reject if deletion failed", async() => {
            nock("http://localhost:5984", {
                "reqheaders": {
                    "Cookie": "AuthSession=" + accessToken,
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                }
            })
                .delete(`/${dbName}/${docId}?rev=${revision}`)
                .replyWithError({
                    "code": "ECONNREFUSED",
                    "errno": "ECONNREFUSED",
                    "syscall": "connect",
                    "address": "127.0.0.1",
                    "port": 5984
                });

            const couchClientInstance = new CouchClient(accessToken, dbName);
            await couchClientInstance.deleteDocument(docId, revision).catch((error) => {
                assert.strictEqual("ECONNREFUSED", error.code);
            });
        });
    });
});
