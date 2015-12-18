/* eslint max-nested-callbacks: [2, 7] */

"use strict";

import CreateDefaultCategoryDocument from "../../src/db/CreateDefaultCategoryDocument.js";
import HttpResponseHandler from "../../../common/src/HttpResponseHandler.js";
import ApplicationConfig from "../../src/config/ApplicationConfig.js";

import { assert } from "chai";
import sinon from "sinon";
import nock from "nock";


let defaultDocument = null, response = null, accessToken = "testToken", dbName = "testDb";

describe("CreateDefaultCategoryDocument", ()=> {


    describe("up", () => {

        before("up", () => {

            defaultDocument = {
                "docType": "category",
                "name": "TimeLine"
            };
            response = { "ok": true, "id": "87cd474590eb6e509c56b7f40f003272", "rev": "1-aeb207d8a0798b59973db0a86dc79a6a" };

        });

        it("should create default category document", (done) => {

            nock("http://localhost:5984", {
                "reqheaders": { "Cookie": "AuthSession=" + accessToken, "Content-Type": "application/json", "Accept": "application/json" } })
                .post("/" + dbName, defaultDocument)
                .reply(HttpResponseHandler.codes.OK, response);

            let appEnvMock = sinon.mock(ApplicationConfig).expects("dbUrl");
            appEnvMock.returns("http://localhost:5984");

            let defaultDocumentInstance = new CreateDefaultCategoryDocument(dbName, accessToken);
            let getDocumentStub = sinon.stub(defaultDocumentInstance, "getDocument");
            getDocumentStub.returns(defaultDocument);

            defaultDocumentInstance.up().then((actualResponse)=> {
                assert.strictEqual(HttpResponseHandler.codes.OK, actualResponse.statusCode);
                assert.deepEqual(response, actualResponse.body);
                appEnvMock.verify();
                ApplicationConfig.dbUrl.restore();
                defaultDocumentInstance.getDocument.restore();
                done();
            });
        });

        it("should reject creating default category document if there is an error", (done) => {
            let errorObj = {
                "code": "ECONNREFUSED",
                "errno": "ECONNREFUSED",
                "syscall": "connect",
                "address": "http://localhost:5984",
                "port": 5984
            };
            nock("http://localhost:5984", {
                "reqheaders": { "Cookie": "AuthSession=" + accessToken, "Content-Type": "application/json", "Accept": "application/json" } })
                .post("/" + dbName, defaultDocument)
                .replyWithError(errorObj);

            let appEnvMock = sinon.mock(ApplicationConfig).expects("dbUrl");
            appEnvMock.returns("http://localhost:5984");

            let defaultDocumentInstance = new CreateDefaultCategoryDocument(dbName, accessToken);
            let getDocumentStub = sinon.stub(defaultDocumentInstance, "getDocument");
            getDocumentStub.returns(defaultDocument);

            defaultDocumentInstance.up().catch((error)=> {
                assert.deepEqual(errorObj, error);
                appEnvMock.verify();
                ApplicationConfig.dbUrl.restore();
                defaultDocumentInstance.getDocument.restore();
                done();
            });

        });

    });
});
