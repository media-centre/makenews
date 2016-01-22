/* eslint no-unused-expressions:0, max-nested-callbacks: [2, 5] */

"use strict";
import CouchSession from "../src/CouchSession.js";
import HttpResponseHandler from "../../common/src/HttpResponseHandler.js";
import ApplicationConfig from "../src/config/ApplicationConfig.js";

import nock from "nock";
import { expect } from "chai";
import sinon from "sinon";


describe("CouchSessionSpec", () => {
    let applicationConfig = null;
    before("CouchClient", () => {
        applicationConfig = new ApplicationConfig();
        sinon.stub(ApplicationConfig, "instance").returns(applicationConfig);
        sinon.stub(applicationConfig, "dbUrl").returns("http://localhost:5984");
    });

    after("CouchClient", () => {
        ApplicationConfig.instance.restore();
        applicationConfig.dbUrl.restore();
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
                expect("").to.equal(userName);
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

});
