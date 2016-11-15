"use strict";
import URLDocument from "../../../src/migration/db/20161114174315_URLDocument.js";
import Migration from "../../../src/migration/Migration.js";
import HttpResponseHandler from "../../../../common/src/HttpResponseHandler.js";
import ApplicationConfig from "../../../src/config/ApplicationConfig.js";
import {assert} from "chai";
import sinon from "sinon";
import nock from "nock";


describe("URLDocument", () => {
    let designDocument = null, response = null, accessToken = "YWRtaW46NTY3MzlGNDM6qVNIU4P7LcqONOyTkyVcTXVaAZ8", dbName = "test1";
    let migrationLoggerStub = null, applicationConfig = null;
    before("URLDocument", () => {
        migrationLoggerStub = sinon.stub(Migration, "logger");
        migrationLoggerStub.withArgs(dbName).returns({
            "error": (message, ...insertions) =>{
            },
            "info": (message, ...insertions)=> {
            },
            "debug": (message, ...insertions)=> {
            }
        });
        applicationConfig = new ApplicationConfig();
        sinon.stub(ApplicationConfig, "instance").returns(applicationConfig);
        sinon.stub(applicationConfig, "dbUrl").returns("http://localhost:5984");
    });

    after("URLDocument", () => {
        Migration.logger.restore();
        ApplicationConfig.instance.restore();
        applicationConfig.dbUrl.restore();
    });

    describe("up", () => {

        before("up", () => {
            designDocument = {
                "language": "javascript",
                "views": {
                    "allCategories": {
                        "map": "function(doc) { if(doc.docType === 'category') {emit(doc.docType, doc)} }"
                    }
                }
            };

            response = { "ok": true, "id": "_design/category", "rev": "1-917fa2381192822767f010b95b45325b" };
        });

        it("should create URL documents", (done) => {

            nock("http://localhost:5984", {
                "reqheaders": { "Cookie": "AuthSession=" + accessToken, "Content-Type": "application/json", "Accept": "application/json" } })
                .put("/" + dbName + "/_all_docs?include_docs=true", designDocument)
                .reply(HttpResponseHandler.codes.OK, response);

            let urlDocument = new URLDocument(dbName, accessToken);
            let getDocumentStub = sinon.stub(urlDocument, "getDocument");
            getDocumentStub.returns(designDocument);

            urlDocument.up().then((actualResponse)=> {
                assert.deepEqual(response, actualResponse);
                urlDocument.getDocument.restore();
                done();
            });
        });

        it("should reject creating URL document if there is an error", (done) => {

            nock("http://localhost:5984", {
                "reqheaders": { "Cookie": "AuthSession=wrongToken", "Content-Type": "application/json", "Accept": "application/json" } })
                .put("/" + dbName + "/_design/category", designDocument)
                .reply(HttpResponseHandler.codes.OK, response);

            let urlDocument = new URLDocument(dbName, accessToken);
            let getDocumentStub = sinon.stub(urlDocument, "getDocument");
            getDocumentStub.returns(designDocument);

            urlDocument.up().catch(() => {
                urlDocument.getDocument.restore();
                done();
            });

        });

    });

    describe("getDocument", () => {
        it("should fetch the URLDocument json and return", () => {
            let designDocumentInstance = new URLDocument(dbName, accessToken);
            let designDocJson = designDocumentInstance.getDocument();
            assert.strictEqual("javascript", designDocJson.language);
            assert.isTrue(Object.keys(designDocJson.views).length > 0);
        });
    });
});


