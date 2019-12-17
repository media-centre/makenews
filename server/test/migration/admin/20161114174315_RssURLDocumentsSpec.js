/* eslint max-nested-callbacks: [2, 7]*/
import RssURLDocuments from "../../../src/migration/admin/20161114174315_RssURLDocuments";
import Migration from "../../../src/migration/Migration";
import HttpResponseHandler from "../../../../common/src/HttpResponseHandler";
import ApplicationConfig from "../../../src/config/ApplicationConfig";
import { assert } from "chai";
import sinon from "sinon";
import nock from "nock";

describe("RssURLDocuments", ()=> {
    let defaultDocument = null;
    let response = null;
    const accessToken = "testToken";
    const dbName = "testDb";
    let sandbox = null;
    let migrationLoggerStub = null;
    let applicationConfig = null;

    before("RssURLDocuments", () => {
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
    after("RssURLDocuments", () => {
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

            const defaultDocumentInstance = new RssURLDocuments(dbName, accessToken);
            const getDocumentStub = sinon.stub(defaultDocumentInstance, "getDocument");
            getDocumentStub.returns(defaultDocument);

            defaultDocumentInstance.up().then((actualResponse)=> {
                assert.deepEqual(response, actualResponse);
                defaultDocumentInstance.getDocument.restore();
                done();
            });
        });

        it("should reject creating default URL document if there is an error", (done) => {
            const errorObj = {
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

            const defaultDocumentInstance = new RssURLDocuments(dbName, accessToken);
            const getDocumentStub = sinon.stub(defaultDocumentInstance, "getDocument");
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
            const defaultDocumentInstance = new RssURLDocuments(dbName, accessToken);
            const defaultURLJson = defaultDocumentInstance.getDocument();
            const zeroIndex = 0;
            assert.deepEqual("web", defaultURLJson.docs[zeroIndex].sourceType);
            assert.deepEqual("source", defaultURLJson.docs[zeroIndex].docType);
        });
    });
});

