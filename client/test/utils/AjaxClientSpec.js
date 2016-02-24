/* eslint no-unused-expressions:0, max-nested-callbacks: [2, 5]*/

"use strict";
import AjaxClient from "../../src/js/utils/AjaxClient.js";
import UserSession from "../../src/js/user/UserSession.js";
import AppWindow from "../../src/js/utils/AppWindow.js";
import HttpResponseHandler from "../../../common/src/HttpResponseHandler.js";
import { expect } from "chai";
import nock from "nock";
import sinon from "sinon";

describe("AjaxClient", function() {
    let userSessionMock = null, sandbox = null, userSession = null;
    beforeEach("beforeEach", () => {
        sandbox = sinon.sandbox.create();
        userSession = new UserSession();
        sandbox.stub(UserSession, "instance").returns(userSession);
        userSessionMock = sandbox.mock(userSession).expects("continueSessionIfActive");
        let appWindow = new AppWindow();
        sinon.stub(appWindow, "get").withArgs("serverUrl").returns("http://localhost:5000");
        sinon.stub(AppWindow, "instance").returns(appWindow);

    });

    afterEach("afterEach", () => {
        sandbox.restore();
        AppWindow.instance.restore();
    });

    describe("post", () => {
        it("should post and return success promise on success", function(done) {
            let url = "/login";
            let headers = {};
            let data = { "username": "username", "password": "pwd" };
            nock("http://localhost:5000")
                .post(url, JSON.stringify(data))
                .reply(HttpResponseHandler.codes.OK, { "data": "success" }, {});
            let ajax = new AjaxClient(url);
            userSessionMock.verify();
            ajax.post(headers, data)
                .then(succesData => {
                    expect(succesData.data).to.eq("success");
                    done();
                });
        });

        it("should post and return error promise on failure", function(done) {
            let url = "/login";
            let headers = {};
            let data = { "username": "ssds", "password": "sds" };
            nock("http://localhost:5000")
                .post(url, JSON.stringify(data))
                .reply(HttpResponseHandler.codes.UNAUTHORIZED, { "data": "error" }, {});
            let ajax = new AjaxClient(url);
            ajax.post(headers, data)
                .catch((errorData) => {
                    expect(errorData.data).to.eq("error");
                    done();
                });
        });

        it("should logout if session expired", function(done) {
            let url = "/login";
            let headers = {};
            let data = { "username": "ssds", "password": "sds" };
            nock("http://localhost:5000")
                .post(url, JSON.stringify(data))
                .reply(HttpResponseHandler.codes.UNAUTHORIZED, { "message": "session expired" }, {});
            let ajax = new AjaxClient(url);
            let userSessionLogOutMock = sandbox.mock(userSession).expects("autoLogout");
            ajax.post(headers, data)
                .catch(() => {
                    userSessionLogOutMock.verify();
                    done();
                });
        });
    });

    describe("get", () => {
        it("should do a get request to the url", function(done) {
            nock("http://localhost:5000")
                .get("/home")
                .reply(HttpResponseHandler.codes.OK, { "data": "success" });

            let ajax = new AjaxClient("/home");
            ajax.get().then(succesData => {
                expect(succesData.data).to.eq("success");
                done();
            });
        });

        it("should do a get request with query parameter to the url", function() {
            nock("http://localhost:5000")
                .get("/rss-feeds")
                .query({ "url": "http://rssfedd.com" })
                .reply(HttpResponseHandler.codes.OK, { "data": "success" });

            let ajax = new AjaxClient("/rss-feeds");
            return ajax.get({ "url": "http://rssfedd.com" }).then(succesData => {
                expect(succesData.data).to.eq("success");
            });
        });

        it("should do a get request with multiple query parameters to the url", function() {
            nock("http://localhost:5000")
                .get("/rss-feeds")
                .query({ "url": "http://rssfedd.com", "page": 1 })
                .reply(HttpResponseHandler.codes.OK, { "data": "success" });

            let ajax = new AjaxClient("/rss-feeds");
            return ajax.get({ "url": "http://rssfedd.com", "page": 1 }).then(succesData => {
                expect(succesData.data).to.eq("success");
            });
        });

        it("should handle for empty objects", () => {
            nock("http://localhost:5000")
                .get("/rss-feeds")
                .reply(HttpResponseHandler.codes.OK, { "data": "success" });

            let ajax = new AjaxClient("/rss-feeds");
            return ajax.get({}).then(succesData => {
                expect(succesData.data).to.eq("success");
            });
        });

        it("should handle for 404", () => {
            nock("http://localhost:5000")
                .get("/rss-feeds")
                .reply(HttpResponseHandler.codes.NOT_FOUND, "error");

            let ajax = new AjaxClient("/rss-feeds");
            return ajax.get({}).catch(errorData => {
                expect(errorData).to.eq("error");
            });
        });

        it("should reject on connection refused", function(done) {
            let url = "/home";
            nock("http://localhost:5000")
                .get(url)
                .reply(HttpResponseHandler.codes.BAD_GATEWAY);

            let ajax = new AjaxClient(url);
            ajax.get().catch(errorData => {
                expect(errorData).to.eq("connection refused");
                done();
            });
        });
    });
});
