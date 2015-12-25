/* eslint max-nested-callbacks: [2, 7] */
"use strict";

import CouchClient from "../src/CouchClient.js";
import NodeErrorHandler from "../src/NodeErrorHandler.js";
import HttpResponseHandler from "../../common/src/HttpResponseHandler.js";
import ApplicationConfig from "../src/config/ApplicationConfig.js";
import sinon from "sinon";

import { assert } from "chai";
import nock from "nock";

describe("CouchClient", () => {
    let dbName = "test", accessToken = "dmlrcmFtOjU2NzdCREJBOhK9v521YI6LBX32KPdmgNMX9mGt", documentId = "schema_info", response = null;

    describe("saveDocument", () => {
        before("saveDocument", () => {
            response = { "ok": true, "id": "schema_info", "rev": "1-917fa2381192822767f010b95b45325b" };
        });

        it("should save the document with the given id", (done) => {
            let documentObj = { "lastMigratedTimeStamp": "20151217145510" };

            nock("http://localhost:5984", {
                "reqheaders": { "Cookie": "AuthSession=" + accessToken, "Content-Type": "application/json", "Accept": "application/json" } })
                .put("/" + dbName + "/schema_info", documentObj)
                .reply(HttpResponseHandler.codes.OK, response);

            let nodeErrorHandlerMock = sinon.mock(NodeErrorHandler).expects("noError");
            nodeErrorHandlerMock.returns(true);
            let dbUrlStub = sinon.stub(ApplicationConfig, "dbUrl");
            dbUrlStub.returns("http://localhost:5984");
            let couchClientInstance = new CouchClient(dbName, accessToken);
            couchClientInstance.saveDocument(documentId, documentObj).then((actualResponse) => {
                assert.deepEqual(response, actualResponse);
                nodeErrorHandlerMock.verify();
                NodeErrorHandler.noError.restore();
                ApplicationConfig.dbUrl.restore();
                done();
            });
        });

        it("should reject with error if there is any error", (done) => {
            let documentObj = { "lastMigratedTimeStamp": "20151217145510" };

            nock("http://localhost:5984", {
                "reqheaders": { "Cookie": "AuthSession=" + accessToken, "Content-Type": "application/json", "Accept": "application/json" } })
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
            let dbUrlStub = sinon.stub(ApplicationConfig, "dbUrl");
            dbUrlStub.returns("http://localhost:5984");
            let couchClientInstance = new CouchClient(dbName, accessToken);
            couchClientInstance.saveDocument(documentId, documentObj).catch((error) => {
                assert.strictEqual("ECONNREFUSED", error.code);
                nodeErrorHandlerMock.verify();
                NodeErrorHandler.noError.restore();
                ApplicationConfig.dbUrl.restore();
                done();
            });
        });

        it("should reject with error if the response code is not 200", (done) => {
            let documentObj = { "lastMigratedTimeStamp": "20151217145510" };
            nock("http://localhost:5984", {
                "reqheaders": { "Cookie": "AuthSession=" + accessToken, "Content-Type": "application/json", "Accept": "application/json" } })
                .put("/" + dbName + "/schema_info", documentObj)
                .reply(HttpResponseHandler.codes.NOT_FOUND, "unexpected response from the db");

            let dbUrlStub = sinon.stub(ApplicationConfig, "dbUrl");
            dbUrlStub.returns("http://localhost:5984");
            let nodeErrorHandlerMock = sinon.mock(NodeErrorHandler).expects("noError");
            nodeErrorHandlerMock.returns(true);
            let couchClientInstance = new CouchClient(dbName, accessToken);
            couchClientInstance.saveDocument(documentId, documentObj).catch((error) => {
                assert.strictEqual("unexpected response from the db", error);
                nodeErrorHandlerMock.verify();
                NodeErrorHandler.noError.restore();
                ApplicationConfig.dbUrl.restore();
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

