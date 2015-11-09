/* eslint no-unused-expressions:0, max-nested-callbacks: [2, 5] */

"use strict";
import AllUrlHelper from "../../../src/routes/helpers/AllUrlHelper.js";
import CouchSession from "../../../src/CouchSession.js";
import HttpResponseHandler from "../../../../common/src/HttpResponseHandler.js";
import sinon from "sinon";
import { expect } from "chai";


describe("AllUrlHelper", () => {

    describe("whiteList", () => {

        it("should return true if the url is in whitelist", () => {
            const url = "/login";
            expect(AllUrlHelper.whiteList(url)).to.be.ok;
        });

        it("should return false if the url is not in whitelist", () => {
            const url = "/test";
            expect(AllUrlHelper.whiteList(url)).to.be.not.ok;

        });

        it("should validate for the non empty url", () => {
            const url = "";
            try {
                AllUrlHelper.whiteList(url);
            } catch(error) {
                expect(error.message).to.equal("url can not be empty");
            }
        });
    });

    describe("allUrlsCallback", () => {
        let whiteListStub = null, couchSessionStub = null, request = null;

        beforeEach("allUrlsCallback", () => {
            whiteListStub = sinon.stub(AllUrlHelper, "whiteList");
            couchSessionStub = sinon.stub(CouchSession, "authenticate");
            request = {
                "cookies": {
                            "AuthSession": "test_auth_session"
                        },
                "originalUrl": "test_url"
            };
        });

        afterEach("allUrlsCallback", () => {
            whiteListStub.restore();
            couchSessionStub.restore();
        });

        it("should proceed to nextSpy if the url is in whitelist", () => {
            let nextSpy = sinon.spy();
            whiteListStub.withArgs(request.originalUrl).returns(true);
            AllUrlHelper.allUrlsCallback(request, nextSpy);
            expect(nextSpy.called).to.be.ok;
        });

        it("should go through authentication if the url is not in whitelist", () => {
            let nextSpy = sinon.spy();
            let promise = new Promise((resolve) => {
                resolve("test_user");
            });
            whiteListStub.withArgs(request.originalUrl).returns(false);
            couchSessionStub.withArgs(request.cookies.AuthSession).returns(promise);
            AllUrlHelper.allUrlsCallback(request, nextSpy);
            expect(nextSpy.called).to.be.not.ok;
        });

        it("should raise authorization error if the token is not valid", () => {
            let nextSpy = sinon.spy();
            whiteListStub.withArgs(request.originalUrl).returns(false);
            couchSessionStub.withArgs(request.cookies.AuthSession).returns(Promise.reject(""));
            AllUrlHelper.allUrlsCallback(request, nextSpy);
        });

        it("should raise authorization error if there is no token in request", () => {
            let nextSpy = sinon.spy();
            request = {
                "cookies": {},
                "originalUrl": "test_url"
            };
            whiteListStub.withArgs(request.originalUrl).returns(false);
            AllUrlHelper.allUrlsCallback(request, nextSpy);
            expect(nextSpy.called).to.be.ok;
            expect("unthorized").to.equal(nextSpy.getCall(0).args[0].message);
            expect(HttpResponseHandler.codes.UNAUTHORIZED).to.equal(nextSpy.getCall(0).args[0].status);
        });

    });

});
