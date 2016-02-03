/* eslint no-unused-expressions:0, max-nested-callbacks: [2, 5] */

"use strict";
import DefaultRoute from "../../../src/routes/helpers/DefaultRoute.js";
import CouchSession from "../../../src/CouchSession.js";
import HttpResponseHandler from "../../../../common/src/HttpResponseHandler.js";
import sinon from "sinon";
import { expect } from "chai";


describe("DefaultRoute", () => {
    let request = null, response = null, next = null;
    beforeEach("DefaultRoute", () => {
        request = {
            "cookies": {
                "AuthSession": "test_auth_session"
            },
            "originalUrl": "/login"
        };

        response = {};
        next = {};
    });

    describe("whiteList", () => {
        it("should return true if the url is login", () => {
            request.originalUrl = "/login";
            expect(new DefaultRoute(request, response, next).isWhitelistUrl()).to.be.ok;
        });

        it("should return true if the url is in app.js", () => {
            request.originalUrl = "/app-min.js";
            expect(new DefaultRoute(request, response, next).isWhitelistUrl()).to.be.ok;
        });

        it("should return true if the url is in app.css", () => {
            request.originalUrl = "/app.css";
            expect(new DefaultRoute(request, response, next).isWhitelistUrl()).to.be.ok;
        });

        it("should return true if the url is in images nesting", () => {
            request.originalUrl = "/images/abc.jpg";
            expect(new DefaultRoute(request, response, next).isWhitelistUrl()).to.be.ok;
        });

        it("should return true if the url is in fonts nesting", () => {
            request.originalUrl = "/fonts/abc.woff";
            expect(new DefaultRoute(request, response, next).isWhitelistUrl()).to.be.ok;
        });

        it("should return false if the url is not in whiteList", () => {
            request.originalUrl = "/test";
            expect(new DefaultRoute(request, response, next).isWhitelistUrl()).to.be.not.ok;
        });

        it("should return false if the url is login/123", () => {
            request.originalUrl = "/login/abcd";
            expect(new DefaultRoute(request, response, next).isWhitelistUrl()).to.be.not.ok;
        });

        it("should validate for the non empty url", () => {
            request.originalUrl = "";
            try {
                new DefaultRoute(request, response, next).isWhitelistUrl();
            } catch(error) {
                expect(error.message).to.equal("url can not be empty");
            }
        });
    });

    describe("handle", () => {
        let couchSessionStub = null, sandbox = null;

        beforeEach("handle", () => {
            sandbox = sinon.sandbox.create();
            couchSessionStub = sandbox.stub(CouchSession, "authenticate");
        });

        afterEach("handle", () => {
            sandbox.restore();
        });

        it("should proceed to nextSpy if the url is in whiteList", () => {
            let nextSpy = sinon.spy();
            new DefaultRoute(request, response, nextSpy).handle();
            expect(nextSpy.called).to.be.ok;
        });

        it("should go through authentication if the url is not in whiteList", () => {
            request.originalUrl = "/test_url";
            let nextSpy = sinon.spy();
            let promise = new Promise((resolve) => {
                resolve("test_user");
            });
            couchSessionStub.withArgs(request.cookies.AuthSession).returns(promise);
            new DefaultRoute(request, response, nextSpy).handle();
            expect(nextSpy.called).to.be.not.ok;
        });

        it("should raise authorization error if the token is not valid", () => {
            request.originalUrl = "/test_url";
            let nextSpy = sinon.spy();
            couchSessionStub.withArgs(request.cookies.AuthSession).returns(Promise.reject(""));
            new DefaultRoute(request, response, nextSpy).handle();

        });

        it("should raise authorization error if there is no token in request", () => {
            let nextSpy = sinon.spy();
            request = {
                "cookies": {},
                "originalUrl": "test_url"
            };
            new DefaultRoute(request, response, nextSpy).handle();
            expect(nextSpy.called).to.be.ok;
            expect("unthorized").to.equal(nextSpy.getCall(0).args[0].message);
            expect(HttpResponseHandler.codes.UNAUTHORIZED).to.equal(nextSpy.getCall(0).args[0].status);
        });

    });

});
