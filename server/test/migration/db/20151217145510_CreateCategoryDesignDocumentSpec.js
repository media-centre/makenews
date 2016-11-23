/* eslint max-nested-callbacks: [2, 7], no-unused-vars:0  */


import CreateCategoryDesignDocument from "../../../src/migration/db/20151217145510_CreateCategoryDesignDocument";
import HttpResponseHandler from "../../../../common/src/HttpResponseHandler";
import ApplicationConfig from "../../../src/config/ApplicationConfig";
import Migration from "../../../src/migration/Migration";

import { assert } from "chai";
import sinon from "sinon";
import nock from "nock";

describe("CreateCategoryDesignDocument", ()=> {
    let designDocument = null, response = null, accessToken = "YWRtaW46NTY3MzlGNDM6qVNIU4P7LcqONOyTkyVcTXVaAZ8", dbName = "test1";
    let migrationLoggerStub = null, applicationConfig = null;
    before("CreateCategoryDesignDocument", () => {
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

    after("CreateCategoryDesignDocument", () => {
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

        it("should create category design document", (done) => {

            nock("http://localhost:5984", {
                "reqheaders": { "Cookie": "AuthSession=" + accessToken, "Content-Type": "application/json", "Accept": "application/json" } })
                .put("/" + dbName + "/_design/category", designDocument)
                .reply(HttpResponseHandler.codes.OK, response);

            let designDocumentInstance = new CreateCategoryDesignDocument(dbName, accessToken);
            let getDocumentStub = sinon.stub(designDocumentInstance, "getDocument");
            getDocumentStub.returns(designDocument);

            designDocumentInstance.up().then((actualResponse)=> {
                assert.deepEqual(response, actualResponse);
                designDocumentInstance.getDocument.restore();
                done();
            });
        });

        it("should reject creating category design document if there is an error", (done) => {

            nock("http://localhost:5984", {
                "reqheaders": { "Cookie": "AuthSession=wrongToken", "Content-Type": "application/json", "Accept": "application/json" } })
                .put("/" + dbName + "/_design/category", designDocument)
                .reply(HttpResponseHandler.codes.OK, response);

            let designDocumentInstance = new CreateCategoryDesignDocument(dbName, accessToken);
            let getDocumentStub = sinon.stub(designDocumentInstance, "getDocument");
            getDocumentStub.returns(designDocument);

            designDocumentInstance.up().catch(() => {
                designDocumentInstance.getDocument.restore();
                done();
            });

        });

    });

    describe("getDocument", () => {
        it("should fetch the CategoryDesignDocument json and return", () => {
            let designDocumentInstance = new CreateCategoryDesignDocument(dbName, accessToken);
            let designDocJson = designDocumentInstance.getDocument();
            assert.strictEqual("javascript", designDocJson.language);
            const zeroIndex = 0;
            assert.isTrue(Object.keys(designDocJson.views).length > zeroIndex);
        });
    });
});
