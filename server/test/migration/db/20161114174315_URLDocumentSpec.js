/* eslint max-nested-callbacks: [2, 7]*/
import URLDocument from "../../../src/migration/db/20161114174315_URLDocument";
import DesignDocumentMigration from "../../../src/migration/helpers/DesignDocumentMigration";
import Migration from "../../../src/migration/Migration";
import HttpResponseHandler from "../../../../common/src/HttpResponseHandler.js";
import ApplicationConfig from "../../../src/config/ApplicationConfig.js";
import { assert } from "chai";
import sinon from "sinon";
import nock from "nock";

describe("URLDocument", ()=> {
    let defaultDocument = null, response = null, accessToken = "testToken", dbName = "testDb";
    let sandbox = null, migrationLoggerStub = null, applicationConfig = null;

    before("URLDocument", () => {
        sandbox = sinon.sandbox.create();
        migrationLoggerStub = sandbox.stub(Migration, "logger");
        migrationLoggerStub.withArgs(dbName).returns({
            "error": (message, ...insertions) => { //eslint-disable-line
            },
            "info": (message, ...insertions)=> { //eslint-disable-line
            },
            "debug": (message, ...insertions)=> { //eslint-disable-line
            }
        });

        applicationConfig = new ApplicationConfig();
        sandbox.stub(ApplicationConfig, "instance").returns(applicationConfig);
        sandbox.stub(applicationConfig, "dbUrl").returns("http://localhost:5984");

    });
    after("URLDocument", () => {
        sandbox.restore();
    });

    describe("up", () => {

        before("up", () => {

            defaultDocument = {
                "docs": [
                    {
                        "docType": "source",
                        "sourceType": "web",
                        "name": "NDTV-LatestNews",
                        "url": "http://feeds.feedburner.com/NDTV-LatestNews"
                    },
                    {
                        "docType": "source",
                        "sourceType": "web",
                        "name": "The Hindu - International",
                        "url": "http://www.thehindu.com/news/international/?service=rss"
                    },
                    {
                        "docType": "source",
                        "sourceType": "web",
                        "name": "The Hindu - Sport",
                        "url": "http://www.thehindu.com/sport/?service=rss"
                    }]
            };
            response = {
                "ok": true,
                "id": "87cd474590eb6e509c56b7f40f003272",
                "rev": "1-aeb207d8a0798b59973db0a86dc79a6a"
            };

        });

        it("should create  default URL document", (done) => {

            nock("http://localhost:5984", {
                "reqheaders": {
                    "Cookie": "AuthSession=" + accessToken,
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                }
            })
                .post("/" + dbName + "/_bulk_docs", defaultDocument)
                .reply(HttpResponseHandler.codes.OK, response);

            let defaultDocumentInstance = new URLDocument(dbName, accessToken);
            let getDocumentStub = sinon.stub(defaultDocumentInstance, "getDocument");
            getDocumentStub.returns(defaultDocument);

            defaultDocumentInstance.up().then((actualResponse)=> {
                assert.deepEqual(response, actualResponse);
                defaultDocumentInstance.getDocument.restore();
                done();
            });
        });

        it("should reject creating default URL document if there is an error", (done) => {
            let errorObj = {
                "code": "ECONNREFUSED",
                "errno": "ECONNREFUSED",
                "syscall": "connect",
                "address": "http://localhost:5984",
                "port": 5984
            };
            nock("http://localhost:5984", {
                "reqheaders": {
                    "Cookie": "AuthSession=" + accessToken,
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                }
            })
                .post("/" + dbName + "/_bulk_docs", defaultDocument)
                .replyWithError(errorObj);

            let defaultDocumentInstance = new URLDocument(dbName, accessToken);
            let getDocumentStub = sinon.stub(defaultDocumentInstance, "getDocument");
            getDocumentStub.returns(defaultDocument);

            defaultDocumentInstance.up().catch((error)=> {
                assert.deepEqual(errorObj, error);
                defaultDocumentInstance.getDocument.restore();
                done();
            });

        });

    });
    describe("getDocument", () => {
        it("should fetch default URL document json and return", () => {
            let defaultDocumentInstance = new URLDocument(dbName, accessToken);
            let defaultURLJson = defaultDocumentInstance.getDocument();
            assert.deepEqual("web",defaultURLJson.docs[0].sourceType);
            assert.deepEqual("source",defaultURLJson.docs[0].docType);
        });
    });
});

