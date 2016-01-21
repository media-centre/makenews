/* eslint max-nested-callbacks: [2, 5]*/

"use strict";
import AdminDbClient from "../../src/db/AdminDbClient";
import CouchSession from "../../src/CouchSession";
import CouchClient from "../../src/CouchClient";
import ApplicationConfig from "../../src/config/ApplicationConfig.js";
import { assert } from "chai";
import sinon from "sinon";

describe("AdminDbClient", () => {
    let sandbox = null;
    beforeEach("AdminDbClient", () => {
        sandbox = sinon.sandbox.create();
    });

    afterEach("AdminDbClient", () => {
        sandbox.restore();
    });
    describe("getDb", () => {
        it("if admin session exists return existing couchClient", (done) => {
            let obj = {};
            sandbox.stub(AdminDbClient, "getDbInstance").returns(obj);
            sandbox.stub(AdminDbClient, "isSessionExpired").returns(false);
            AdminDbClient.instance().getDb().then((response) => {
                assert.deepEqual(response, obj);
                done();
            });
        });

        it("if admin session not exists should login and returns couchClient", (done) => {
            sandbox.stub(AdminDbClient, "getDbInstance").returns(null);
            let applicationConfig = new ApplicationConfig();
            sandbox.stub(ApplicationConfig, "instance").returns(applicationConfig);
            sandbox.stub(CouchSession, "login").returns(Promise.resolve("AuthSession=Token1-2; Version=1; Path=/; HttpOnly"));
            sandbox.stub(applicationConfig, "adminDetails").returns({
                "username": "adminUser",
                "password": "adminPwd",
                "db": "adminDb"
            });

            AdminDbClient.instance().getDb().then((response) => {
                assert.deepEqual(response, new CouchClient("adminDb", "Token1-2"));
                done();
            });
        });

        it("if admin session expires it should login and returns couchClient", (done) => {
            sandbox.stub(AdminDbClient, "getDbInstance").returns({});
            sandbox.stub(AdminDbClient, "isSessionExpired").returns(true);
            let applicationConfig = new ApplicationConfig();
            sandbox.stub(ApplicationConfig, "instance").returns(applicationConfig);
            sandbox.stub(CouchSession, "login").returns(Promise.resolve("AuthSession=Token1-2; Version=1; Path=/; HttpOnly"));
            sandbox.stub(applicationConfig, "adminDetails").returns({
                "username": "adminUser",
                "password": "adminPwd",
                "db": "adminDb"
            });

            AdminDbClient.instance().getDb().then((response) => {
                assert.deepEqual(response, new CouchClient("adminDb", "Token1-2"));
                done();
            });
        });
    });

    describe("getDocument", () => {

        it("should resolve document if exist", (done) => {
            let couchClient = new CouchClient();
            let getDocumentStub = sinon.stub(couchClient, "getDocument");
            let adminDbClient = AdminDbClient.instance();
            sandbox.stub(adminDbClient, "getDb").returns(Promise.resolve(couchClient));
            const doc = { "_id": "facebookToken", "token": "123" };
            getDocumentStub.withArgs("facebookToken").returns(Promise.resolve(doc));
            adminDbClient.getDocument("facebookToken").then((response) => {
                assert.deepEqual(response, doc);
                done();
            });
        });

        it("should reject document if not exist", (done) => {
            let couchClient = new CouchClient();
            let getDocumentStub = sinon.stub(couchClient, "getDocument");
            let adminDbClient = AdminDbClient.instance();
            sandbox.stub(adminDbClient, "getDb").returns(Promise.resolve(couchClient));
            getDocumentStub.withArgs("facebookToken").returns(Promise.reject("error"));
            adminDbClient.getDocument("facebookToken").catch((error) => {
                assert.deepEqual(error, "error");
                done();
            });
        });

        it("should reject document if dbInstance throws error", (done) => {
            let adminDbClient = AdminDbClient.instance();
            sandbox.stub(adminDbClient, "getDb").returns(Promise.reject("db error"));
            adminDbClient.getDocument("facebookToken").catch((error) => {
                assert.deepEqual(error, "db error");
                done();
            });
        });
    });
});
