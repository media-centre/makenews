/* eslint no-unused-expressions:0, max-nested-callbacks: [2, 5]*/

"use strict";
import AjaxClient from "../../src/js/utils/AjaxClient.js";
import UserSession from "../../src/js/user/UserSession.js";
import AppWindow from "../../src/js/utils/AppWindow.js";
import HttpResponseHandler from "../../../common/src/HttpResponseHandler.js";
import { expect, assert } from "chai";
import nock from "nock";
import sinon from "sinon";
import R from "ramda";

describe("AjaxClient", function() {
    let userSessionMock = null, sandbox = null, userSession = null, requests = [];
    beforeEach("beforeEach", () => {
        sandbox = sinon.sandbox.create();
        this.xhr = sinon.useFakeXMLHttpRequest();

        this.xhr.onCreate = function (xhr) {
            requests.push(xhr);
        };

        userSession = new UserSession();
        sandbox.stub(UserSession, "instance").returns(userSession);
        userSessionMock = sandbox.mock(userSession).expects("continueSessionIfActive");
        let appWindow = new AppWindow();
        sinon.stub(appWindow, "get").withArgs("serverUrl").returns("http://localhost:5000");
        sinon.stub(AppWindow, "instance").returns(appWindow);

    });

    afterEach("afterEach", () => {
        this.xhr.restore();
        requests = [];
        sandbox.restore();
        AppWindow.instance.restore();
    });

    var assertRequest = function (request, url, method, data, headers = {}) {
        assert.equal(request.url, "http://localhost:5000" + url);
        assert.equal(request.method, method);
        assert.deepEqual(request.requestHeaders, headers);
        assert.equal(request.requestBody, JSON.stringify(data));
    };

    describe("post", () => {
        it("should post and return success promise on success", (done) => {
            let url = "/login";
            let headers = {};
            let data = { "username": "username", "password": "pwd" };
            let ajax = new AjaxClient(url);
            userSessionMock.verify();
            ajax.post(headers, data)
                .then(succesData => {
                    expect(succesData.data).to.eq("success");
                    done();
                });
            let request = R.head(requests);
            request.respond(HttpResponseHandler.codes.OK, {}, '{"data": "success"}');
            assertRequest(request, url, "POST", data, headers);
        });

        it("should post and return error promise on failure", function(done) {
            let url = "/login";
            let headers = {};
            let data = { "username": "ssds", "password": "sds" };

            let ajax = new AjaxClient(url);
            ajax.post(headers, data)
                .catch((errorData) => {
                    expect(errorData.data).to.eq("error");
                    done();
                });

            let request = R.head(requests);
            request.respond(HttpResponseHandler.codes.UNAUTHORIZED, {}, '{"data": "error"}');
            assertRequest(request, url, "POST", data, headers);
        });

        it("should logout if session expired", function(done) {
            let url = "/login";
            let headers = {};
            let data = { "username": "ssds", "password": "sds" };

            let ajax = new AjaxClient(url);
            let userSessionLogOutMock = sandbox.mock(userSession).expects("autoLogout");
            ajax.post(headers, data)
                .catch(() => {
                    userSessionLogOutMock.verify();
                    done();
                });

            let request = R.head(requests);
            request.respond(HttpResponseHandler.codes.UNAUTHORIZED, {}, '{"message": "session expired"}');
            assertRequest(request, url, "POST", data, headers);
        });
    });

    describe("get", () => {
        it("should do a get request to the url", function(done) {
          var url = "/home";
            let ajax = new AjaxClient(url);
            ajax.get().then(succesData => {
                expect(succesData.data).to.eq("success");
                done();
            });

            let request = R.head(requests);
            request.respond(HttpResponseHandler.codes.OK, {}, '{"data": "success"}');
            assertRequest(request, url, "GET");

        });

        it("should do a get request with query parameter to the url", function(done) {
          var url = "/rss-feeds";
            let ajax = new AjaxClient(url);
            ajax.get({ "url": "http://rssfedd.com" }).then(succesData => {
                expect(succesData.data).to.eq("success");
                done();
            });

            let request = R.head(requests);
            request.respond(HttpResponseHandler.codes.OK, {}, '{"data": "success"}');
            assertRequest(request, url + "?url=http%3A%2F%2Frssfedd.com", "GET");
        });

        it("should do a get request with multiple query parameters to the url", function(done) {
          var url = "/rss-feeds";
            let ajax = new AjaxClient(url);
            ajax.get({ "url": "http://rssfedd.com", "page": 1 }).then(succesData => {
                expect(succesData.data).to.eq("success");
                done();
            });
            let request = R.head(requests);
            request.respond(HttpResponseHandler.codes.OK, {}, '{"data": "success"}');
            assertRequest(request, url + "?url=http%3A%2F%2Frssfedd.com&page=1", "GET");
        });

        it("should handle for empty objects", (done) => {
          var url = "/rss-feeds";
            let ajax = new AjaxClient(url);
            ajax.get({}).then(succesData => {
                expect(succesData.data).to.eq("success");
                done();
            });

            let request = R.head(requests);
            request.respond(HttpResponseHandler.codes.OK, {}, '{"data": "success"}');
            assertRequest(request, url, "GET");
        });

        it("should handle for 404", (done) => {

          var url = "/rss-feeds";
            let ajax = new AjaxClient(url);
            ajax.get({}).catch(errorData => {
                expect(errorData).to.eq("error");
                done();
            });
            let request = R.head(requests);
            request.respond(HttpResponseHandler.codes.NOT_FOUND, {}, "error");
            assertRequest(request, url, "GET");
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

            let request = R.head(requests);
            request.respond(HttpResponseHandler.codes.BAD_GATEWAY);
            assertRequest(request, url, "GET");
        });
    });
});
