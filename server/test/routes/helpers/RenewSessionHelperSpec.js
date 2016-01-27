"use strict";

import HttpResponseHandler from "../../../../common/src/HttpResponseHandler.js";
import RenewSessionHelper from "../../../src/routes/helpers/RenewSessionHelper.js";
import CouchSession from "../../../src/CouchSession.js";
import { expect } from "chai";
import sinon from "sinon";

describe("RenewSessionHelper", () => {
    let token = null, couchSessionAuthenticateMock = null, request = null;
    beforeEach("getUserName", () => {
        token = "dmlrcmFtOjU2NDg5RTM5Osv-2eZkpte3JW8dkoMb1NzK7TmA";
        request = {
            "cookies": {
                "AuthSession": token
            }
        };
        couchSessionAuthenticateMock = sinon.mock(CouchSession).expects("authenticate");
    });
    afterEach("getUserName", () => {
        CouchSession.authenticate.restore();
    });

    it("should return error incase of failure", (done) => {
        let response = {
            "status": function(status) {
                expect(HttpResponseHandler.codes.INTERNAL_SERVER_ERROR).to.equal(status);
                return response;
            },
            "json": function(data) {
                expect(data).to.deep.equal({ "message": "Unable to renew session" });
                done();
            }
        };

        couchSessionAuthenticateMock.withArgs(token).returns(Promise.reject("failed"));
        let renewSessionHelper = new RenewSessionHelper(request, response);
        renewSessionHelper.authenticateAgain();
        couchSessionAuthenticateMock.verify();
    });

    it("should return unauthorised if AuthSession in header is empty", (done) => {
        request = {
            "cookies": {
            }
        };

        let response = {
            "status": function(status) {
                expect(HttpResponseHandler.codes.UNAUTHORIZED).to.equal(status);
                return response;
            },
            "json": function(data) {
                expect(data).to.deep.equal({ "message": "Set AuthSession cookie in request header" });
                done();
            }
        };

        let renewSessionHelper = new RenewSessionHelper(request, response);
        renewSessionHelper.authenticateAgain();
    });

    it("should return unauthorised if cookie in header is empty", (done) => {
        request = {};
        let response = {
            "status": function(status) {
                expect(HttpResponseHandler.codes.UNAUTHORIZED).to.equal(status);
                return response;
            },
            "json": function(data) {
                expect(data).to.deep.equal({ "message": "Set AuthSession cookie in request header" });
                done();
            }
        };

        let renewSessionHelper = new RenewSessionHelper(request, response);
        renewSessionHelper.authenticateAgain();
    });

    it("should return auth session cookie for success", (done) => {
        let renewedCookie = "AuthSession=new token;Version=1; Path=/; HttpOnly";
        let response = {
            "status": function(status) {
                expect(HttpResponseHandler.codes.OK).to.equal(status);
                return response;
            },
            "append": function(cookieName, cookieValue) {
                expect(cookieName).to.equal("Set-Cookie");
                expect(cookieValue).to.equal(renewedCookie);
                return response;
            },
            "json": function(data) {
                expect(data).to.deep.equal({ "message": "session renewed" });
                done();
            }
        };
        couchSessionAuthenticateMock.withArgs(token).returns(Promise.resolve(renewedCookie));
        let renewSessionHelper = new RenewSessionHelper(request, response);
        renewSessionHelper.authenticateAgain();
        couchSessionAuthenticateMock.verify();
    });
});
