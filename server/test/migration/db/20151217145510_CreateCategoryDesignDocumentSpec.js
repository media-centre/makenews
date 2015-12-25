/* eslint max-nested-callbacks: [2, 7] */

"use strict";

import CreateCategoryDesignDocument from "../../../src/migration/db/20151217145510_CreateCategoryDesignDocument.js";
import HttpResponseHandler from "../../../../common/src/HttpResponseHandler.js";
import ApplicationConfig from "../../../src/config/ApplicationConfig.js";

import { assert } from "chai";
import sinon from "sinon";
import nock from "nock";


let designDocument = null, response = null, accessToken = "YWRtaW46NTY3MzlGNDM6qVNIU4P7LcqONOyTkyVcTXVaAZ8", dbName = "test1";

describe("CreateCategoryDesignDocument", ()=> {

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

            let appEnvMock = sinon.mock(ApplicationConfig).expects("dbUrl");
            appEnvMock.returns("http://localhost:5984");

            let designDocumentInstance = new CreateCategoryDesignDocument(dbName, accessToken);
            let getDocumentStub = sinon.stub(designDocumentInstance, "getDocument");
            getDocumentStub.returns(designDocument);

            designDocumentInstance.up().then((actualResponse)=> {
                assert.deepEqual(response, actualResponse);
                appEnvMock.verify();
                ApplicationConfig.dbUrl.restore();
                designDocumentInstance.getDocument.restore();
                done();
            }).catch(error => {
                console.log(error);
            });
        });

        it("should reject creating category design document if there is an error", (done) => {

            nock("http://localhost:5984", {
                "reqheaders": { "Cookie": "AuthSession=wrongToken", "Content-Type": "application/json", "Accept": "application/json" } })
                .put("/" + dbName + "/_design/category", designDocument)
                .reply(HttpResponseHandler.codes.OK, response);

            let appEnvMock = sinon.mock(ApplicationConfig).expects("dbUrl");
            appEnvMock.returns("http://localhost:5984");

            let designDocumentInstance = new CreateCategoryDesignDocument(dbName, accessToken);
            let getDocumentStub = sinon.stub(designDocumentInstance, "getDocument");
            getDocumentStub.returns(designDocument);

            designDocumentInstance.up().catch(() => {
                appEnvMock.verify();
                ApplicationConfig.dbUrl.restore();
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
            assert.isTrue(Object.keys(designDocJson.views).length > 0);
        });
    });
});
