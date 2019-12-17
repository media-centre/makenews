import HttpResponseHandler from "../../../../common/src/HttpResponseHandler";
import RenewSessionRoute from "../../../src/routes/helpers/RenewSessionRoute";
import CouchSession from "../../../src/CouchSession";
import { expect } from "chai";
import sinon from "sinon";

describe("RenewSessionRoute", () => {
    let token = null;
    let couchSessionAuthenticateMock = null;
    let request = null;
    let next = null;
    beforeEach("getUserName", () => {
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
    });

    it("should return error incase of failure", (done) => {
        const response = {
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
        const renewSessionHelper = new RenewSessionRoute(request, response, next);
        renewSessionHelper.handle();
        couchSessionAuthenticateMock.verify();
    });

    it("should return unauthorised if AuthSession in header is empty", (done) => {
        request = {
            "cookies": {
            }
        };

        const response = {
            "status": function(status) {
                expect(HttpResponseHandler.codes.BAD_REQUEST).to.equal(status);
                return response;
            },
            "json": function(data) {
                expect(data).to.deep.equal({ "message": "bad request" });
                done();
            }
        };

        const renewSessionHelper = new RenewSessionRoute(request, response, next);
        renewSessionHelper.handle();
    });

    it("should return unauthorised if cookie in header is empty", (done) => {
        request = {};
        const response = {
            "status": function(status) {
                expect(HttpResponseHandler.codes.BAD_REQUEST).to.equal(status);
                return response;
            },
            "json": function(data) {
                expect(data).to.deep.equal({ "message": "bad request" });
                done();
            }
        };

        const renewSessionHelper = new RenewSessionRoute(request, response, next);
        renewSessionHelper.handle();
    });

    it("should return auth session cookie for success", (done) => {
        const renewedCookie = "AuthSession=new token";
        const response = {
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
        couchSessionAuthenticateMock.withArgs(token).returns(Promise.resolve("new token"));
        const renewSessionHelper = new RenewSessionRoute(request, response, next);
        renewSessionHelper.handle();
        couchSessionAuthenticateMock.verify();
    });
});
