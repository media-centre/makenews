/* eslint no-unused-expressions:0, max-nested-callbacks: [2, 5]*/

import AjaxClient from "../../src/js/utils/AjaxClient";
import UserSession from "../../src/js/user/UserSession";
import AppWindow from "../../src/js/utils/AppWindow";
import HttpResponseHandler from "../../../common/src/HttpResponseHandler";
import { expect, assert } from "chai";
import nock from "nock";
import sinon from "sinon";

describe("AjaxClient", function() {
    let userSessionMock = null, sandbox = null, userSession = null;
    beforeEach("beforeEach", () => {
        sandbox = sinon.sandbox.create();
        userSession = new UserSession();
        sandbox.stub(UserSession, "instance").returns(userSession);
        userSessionMock = sandbox.mock(userSession).expects("setLastAccessedTime");
        let appWindow = new AppWindow();
        sinon.stub(appWindow, "get").withArgs("serverUrl").returns("http://localhost:5000");
        sinon.stub(AppWindow, "instance").returns(appWindow);

    });

    afterEach("afterEach", () => {
        sandbox.restore();
        AppWindow.instance.restore();
    });

    describe("post", () => {
        it("should post and return success promise on success", async() => {
            let url = "/login";
            let headers = {};
            let data = { "username": "username", "password": "pwd" };
            nock("http://localhost:5000")
                .post(url)
                .reply(HttpResponseHandler.codes.OK, { "data": "success" });
            let ajax = new AjaxClient(url);
            userSessionMock.verify();
            try {
                let succesData = await ajax.post(headers, data);
                expect(succesData.data).to.eq("success");
            } catch (err) {
                assert.fail(err);
            }
        });

        it("should post and return error promise on failure", async() => {
            let url = "/login";
            let headers = {};
            let data = { "username": "ssds", "password": "sds" };
            nock("http://localhost:5000")
                .post(url)
                .reply(HttpResponseHandler.codes.UNAUTHORIZED, { "error": "error" });
            let ajax = new AjaxClient(url);
            try {
                await ajax.post(headers, data);
                assert.fail();
            } catch (errorData) {
                expect(errorData.error).to.eq("error");
            }
        });

        it("should logout if session expired", async() => {
            let url = "/login";
            let headers = {};
            let data = { "username": "ssds", "password": "sds" };
            nock("http://localhost:5000")
                .post(url)
                .reply(HttpResponseHandler.codes.UNAUTHORIZED, { "message": "session expired" });
            let ajax = new AjaxClient(url);
            let userSessionLogOutMock = sandbox.mock(userSession).expects("autoLogout");
            try {
                await ajax.post(headers, data);
                assert.fail();
            } catch (error) {
                userSessionLogOutMock.verify();
                expect(error.message).to.eq("session expired");
            }
        });
    });

    describe("get", () => {
        it("should do a get request to the url", async() => {
            var url = "/home";
            let ajax = new AjaxClient(url);
            nock("http://localhost:5000")
                .get(url)
                .reply(HttpResponseHandler.codes.OK, {
                    "data": "success"
                });
            try {
                let successData = await ajax.get();
                expect(successData.data).to.eq("success");
            } catch (err) {
                assert.fail(err);
            }

        });

        it("should do a get request with query parameter to the url", async() => {
            var url = "/rss-feeds";
            let ajax = new AjaxClient(url);
            nock("http://localhost:5000")
                .get(`${url}?url=http%3A%2F%2Frssfedd.com`)
                .reply(HttpResponseHandler.codes.OK, {
                    "data": "success"
                });

            let succesData = await ajax.get({ "url": "http://rssfedd.com" });
            expect(succesData.data).to.eq("success");
        });

        it("should do a get request with multiple query parameters to the url", async() => {
            var url = "/rss-feeds";
            nock("http://localhost:5000")
                .get(`${url}?url=http%3A%2F%2Frssfedd.com&page=1`)
                .reply(HttpResponseHandler.codes.OK, {
                    "data": "success"
                });
            let ajax = new AjaxClient(url);
            try {
                let succesData = await ajax.get({ "url": "http://rssfedd.com", "page": 1 });
                expect(succesData.data).to.eq("success");
            } catch (err) {
                assert.fail(err);
            }
        });

        it("should handle for empty objects", async() => {
            var url = "/rss-feeds";
            nock("http://localhost:5000")
                .get(url)
                .reply(HttpResponseHandler.codes.OK, {
                    "data": "success"
                });
            let ajax = new AjaxClient(url);
            try {
                let succesData = await ajax.get({});
                expect(succesData.data).to.eq("success");
            } catch (err) {
                assert.fail(err);
            }
        });

        it("should handle for 404", async() => {

            var url = "/rss-feeds";
            nock("http://localhost:5000")
                .get(url)
                .reply(HttpResponseHandler.codes.NOT_FOUND, { "error": "error" });
            let ajax = new AjaxClient(url);
            try {
                await ajax.get({});
                assert.fail();
            } catch (errorData) {
                expect(errorData.error).to.eq("error");
            }
        });

        it("should reject on connection refused", async() => {
            let url = "/home";
            nock("http://localhost:5000")
                .get(url)
                .reply(HttpResponseHandler.codes.BAD_GATEWAY, { "error": "connection refused" });

            let ajax = new AjaxClient(url);
            try {
                await ajax.get();
                assert.fail();
            } catch (errorData) {
                expect(errorData).to.eq("connection refused");
            }
        });
    });

    describe("put", () => {
        it("should put and return success promise on success", async() => {
            let url = "/login";
            let headers = {};
            let data = { "username": "username", "password": "pwd" };
            nock("http://localhost:5000")
                .put(url)
                .reply(HttpResponseHandler.codes.OK, { "data": "success" });
            let ajax = new AjaxClient(url);
            userSessionMock.verify();
            try {
                let succesData = await ajax.put(headers, data);
                expect(succesData.data).to.eq("success");
            } catch (err) {
                assert.fail(err);
            }
        });

        it("should put and return error promise on failure", async() => {
            let url = "/login";
            let headers = {};
            let data = { "username": "ssds", "password": "sds" };
            nock("http://localhost:5000")
                .put(url)
                .reply(HttpResponseHandler.codes.UNAUTHORIZED, { "error": "error" });
            let ajax = new AjaxClient(url);
            try {
                await ajax.put(headers, data);
                assert.fail();
            } catch (errorData) {
                expect(errorData.error).to.eq("error");
            }
        });

        it("should logout if session expired", async() => {
            let url = "/login";
            let headers = {};
            let data = { "username": "ssds", "password": "sds" };
            nock("http://localhost:5000")
                .put(url)
                .reply(HttpResponseHandler.codes.UNAUTHORIZED, { "message": "session expired" });
            let ajax = new AjaxClient(url);
            let userSessionLogOutMock = sandbox.mock(userSession).expects("autoLogout");
            try {
                await ajax.put(headers, data);
                assert.fail();
            } catch (error) {
                userSessionLogOutMock.verify();
                expect(error.message).to.eq("session expired");
            }
        });
    });

    describe("deleteRequest", () => {
        it("should do a delete request to the url", async() => {
            const url = "/collection";
            const ajax = new AjaxClient(url);
            nock("http://localhost:5000")
                .delete(url)
                .reply(HttpResponseHandler.codes.OK, {
                    "data": "success"
                });

            const successData = await ajax.deleteRequest({});

            expect(successData.data).to.eq("success");
        });

        it("should do a delete request with query parameter to the url", async() => {
            const url = "/collection";
            const ajax = new AjaxClient(url);
            nock("http://localhost:5000")
                .delete(`${url}?collection=testCollection`)
                .reply(HttpResponseHandler.codes.OK, {
                    "data": "success"
                });

            const succesData = await ajax.deleteRequest({ "collection": "testCollection" });
            expect(succesData.data).to.eq("success");
        });


        it("should handle for 404", async() => {

            const url = "/collection";
            nock("http://localhost:5000")
                .delete(url)
                .reply(HttpResponseHandler.codes.NOT_FOUND, { "error": "error" });
            const ajax = new AjaxClient(url);
            try {
                await ajax.deleteRequest({});
                assert.fail();
            } catch (errorData) {
                expect(errorData.error).to.eq("error");
            }
        });

        it("should reject on connection refused", async() => {
            const url = "/collection";
            nock("http://localhost:5000")
                .delete(url)
                .reply(HttpResponseHandler.codes.BAD_GATEWAY, { "error": "connection refused" });

            const ajax = new AjaxClient(url);
            try {
                await ajax.deleteRequest();
                assert.fail();
            } catch (errorData) {
                expect(errorData).to.eq("connection refused");
            }
        });
    });

});
