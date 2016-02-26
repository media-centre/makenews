/* eslint no-unused-expressions:0, max-nested-callbacks: [2, 5] */

"use strict";
import CouchSession from "../src/CouchSession.js";
import HttpResponseHandler from "../../common/src/HttpResponseHandler.js";
import ApplicationConfig from "../src/config/ApplicationConfig.js";
import LogTestHelper from "./helpers/LogTestHelper";
import CouchClient from "../src/CouchClient.js";

import nock from "nock";
import { expect, assert } from "chai";
import sinon from "sinon";


describe("CouchSessionSpec", () => {
    let applicationConfig = null;
    before("CouchClient", () => {
        applicationConfig = new ApplicationConfig();
        sinon.stub(ApplicationConfig, "instance").returns(applicationConfig);
        sinon.stub(applicationConfig, "dbUrl").returns("http://localhost:5984");
        sinon.stub(CouchSession, "logger").returns(LogTestHelper.instance());
    });

    after("CouchClient", () => {
        ApplicationConfig.instance.restore();
        applicationConfig.dbUrl.restore();
        CouchSession.logger.restore();
    });


    describe("login", () => {
        it("should login user with given username and password", (done) => {
            let username = "test_user";
            let password = "test_password";
            nock("http://localhost:5984")
                .post("/_session", {
                    "name": username,
                    "password": password
                })
                .reply(HttpResponseHandler.codes.OK, "", {
                    "set-cookie": ["test_token"]
                });

            CouchSession.login(username, password).then((token) => {
                expect(token).to.have.string("test_token");
                done();
            });
        });

        it("should fail if username/password are invalid", (done) => {
            let username = "test_user";
            let password = "test_password";
            nock("http://localhost:5984")
                .post("/_session", {
                    "name": username,
                    "password": password
                })
                .replyWithError({
                    "code": "ECONNREFUSED",
                    "errno": "ECONNREFUSED",
                    "syscall": "connect",
                    "address": "127.0.0.1",
                    "port": 5984
                });

            CouchSession.login(username, password).catch((error) => {
                expect(error.code).to.have.string("ECONNREFUSED");
                expect(error.errno).to.have.string("ECONNREFUSED");
                done();
            });
        });
    });

    describe("authenticate", () => {
        it("should send the auth token if authCookie is present in couch response", (done) => {
            let token = "12345678";
            nock("http://localhost:5984", {
                "reqheaders": { "Cookie": "AuthSession=" + token }
            })
            .get("/_session")
            .reply(HttpResponseHandler.codes.OK, {
                "userCtx": { "name": "test_user", "roles": [] }
            }, {
                "set-cookie": ["test_token"]
            });

            CouchSession.authenticate(token).then((newToken) => {
                expect(newToken).to.have.string("test_token");
                done();
            });
        });

        it("should send the auth token if authCookie is present in couch response", (done) => {
            let token = "12345678";
            nock("http://localhost:5984", {
                "reqheaders": { "Cookie": "AuthSession=" + token }
            })
            .get("/_session")
            .reply(HttpResponseHandler.codes.OK, {
                "userCtx": { "name": "test_user", "roles": [] }
            });

            CouchSession.authenticate(token).then((newToken) => {
                expect(newToken).to.have.string(token);
                done();
            });
        });

        it("should return the reject promise if the token is invalid", (done) => {
            let token = "12345678";
            nock("http://localhost:5984", {
                "reqheaders": {
                    "Cookie": "AuthSession=" + token
                }
            })
            .get("/_session")
            .reply(HttpResponseHandler.codes.OK, {
                "userCtx": { "name": "", "roles": [] }
            });

            CouchSession.authenticate(token).catch((userName) => {
                expect("unauthenticated user").to.equal(userName);
                done();
            });
        });

        it("should return the reject promise with actual error if service is not available", (done) => {
            let token = "12345678";
            nock("http://localhost:5984", {
                "reqheaders": {
                    "Cookie": "AuthSession=" + token
                }
            })
            .get("/_session")
            .replyWithError({
                "code": "ECONNREFUSED",
                "errno": "ECONNREFUSED",
                "syscall": "connect",
                "address": "127.0.0.1",
                "port": 5984
            });

            CouchSession.authenticate(token).catch((error) => {
                expect(error.code).to.have.string("ECONNREFUSED");
                expect(error.errno).to.have.string("ECONNREFUSED");
                done();
            });
        });
    });

    describe("updatePassword", () => {
        let sandbox = null, couchClient = null, username = null, newPassword = null, token = null;
        beforeEach("updatePassword", () => {
            sandbox = sinon.sandbox.create();
            token = "12345678";
            couchClient = new CouchClient("_users", token);
            sandbox.stub(CouchClient, "instance").returns(couchClient);
            username = "test";
            newPassword = "new_password";
        });

        afterEach("getUserDocument", () => {
            sandbox.restore();
        });

        it("should update the password for the given user", (done) => {

            let getDocumentMock = sandbox.mock(couchClient).expects("getDocument");
            getDocumentMock.returns(Promise.resolve({
                "_id": "org.couchdb.user:" + username,
                "_rev": "12345",
                "derived_key": "test derived key",
                "iterations": 10,
                "name": "test_user",
                "password_scheme": "scheme",
                "roles": [],
                "salt": "123324124124",
                "type": "user"
            }));
            let saveDocumentMock = sandbox.mock(couchClient).expects("saveDocument");
            saveDocumentMock.returns(Promise.resolve({
                "ok": true,
                "id": "org.couchdb.user:test",
                "rev": "new revision"
            }));
            CouchSession.updatePassword(username, newPassword, token).then((response) => {
                assert.equal(response.ok, true);
                getDocumentMock.verify();
                saveDocumentMock.verify();
                done();
            });
        });

        it("should reject with error if there is an issue while getting the user document", (done) => {
            sandbox.stub(couchClient, "getDocument").returns(Promise.reject("error"));
            CouchSession.updatePassword(username, newPassword, token).catch((error) => {
                assert.equal("error", error);
                done();
            });
        });

        it("should reject with error if there is an issue while updating the user document", (done) => {
            sandbox.stub(couchClient, "getDocument").returns(Promise.resolve({
                "_id": "org.couchdb.user:" + username,
                "_rev": "12345",
                "derived_key": "test derived key",
                "iterations": 10,
                "name": "test_user",
                "password_scheme": "scheme",
                "roles": [],
                "salt": "123324124124",
                "type": "user"
            }));
            sandbox.stub(couchClient, "saveDocument").returns(Promise.reject("error"));
            CouchSession.updatePassword(username, newPassword, token).catch((error) => {
                assert.equal("error", error);
                done();
            });
        });
    });
});
