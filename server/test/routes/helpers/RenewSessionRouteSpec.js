

import HttpResponseHandler from "../../../../common/src/HttpResponseHandler";
import RenewSessionRoute from "../../../src/routes/helpers/RenewSessionRoute";
import Logger from "../../../src/logging/Logger";
import CouchSession from "../../../src/CouchSession";
import LogTestHelper from "../../helpers/LogTestHelper";
import { expect } from "chai";
import sinon from "sinon";

describe("RenewSessionRoute", () => {
    let token = null, couchSessionAuthenticateMock = null, request = null, next = null;
    beforeEach("getUserName", () => {
        sinon.stub(Logger, "instance").returns(LogTestHelper.instance());
        token = "dmlrcmFtOjU2NDg5RTM5Osv-2eZkpte3JW8dkoMb1NzK7TmA";
        request = {
            "cookies": {
                "AuthSession": token
            }
        };
        couchSessionAuthenticateMock = sinon.mock(CouchSession).expects("authenticate");
        next = {};
    });
    afterEach("getUserName", () => {
        CouchSession.authenticate.restore();
        Logger.instance.restore();
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
        let renewSessionHelper = new RenewSessionRoute(request, response, next);
        renewSessionHelper.handle();
        couchSessionAuthenticateMock.verify();
    });

    it("should return unauthorised if AuthSession in header is empty", (done) => {
        request = {
            "cookies": {
            }
        };

        let response = {
            "status": function(status) {
                expect(HttpResponseHandler.codes.BAD_REQUEST).to.equal(status);
                return response;
            },
            "json": function(data) {
                expect(data).to.deep.equal({ "message": "bad request" });
                done();
            }
        };

        let renewSessionHelper = new RenewSessionRoute(request, response, next);
        renewSessionHelper.handle();
    });

    it("should return unauthorised if cookie in header is empty", (done) => {
        request = {};
        let response = {
            "status": function(status) {
                expect(HttpResponseHandler.codes.BAD_REQUEST).to.equal(status);
                return response;
            },
            "json": function(data) {
                expect(data).to.deep.equal({ "message": "bad request" });
                done();
            }
        };

        let renewSessionHelper = new RenewSessionRoute(request, response, next);
        renewSessionHelper.handle();
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
        let renewSessionHelper = new RenewSessionRoute(request, response, next);
        renewSessionHelper.handle();
        couchSessionAuthenticateMock.verify();
    });
});
