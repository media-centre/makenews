/* eslint max-nested-callbacks:0 */
"use strict";
import TwitterRequestHandler from "../../src/js/twitter/TwitterRequestHandler.js";
import TwitterLogin from "../../src/js/twitter/TwitterLogin.js";
import AppWindow from "../../src/js/utils/AppWindow.js";
import LoginPage from "../../src/js/login/pages/LoginPage.jsx";
import FacebookTwitterDb from "../../src/js/socialAccounts/FacebookTwitterDb.js";
import sinon from "sinon";
import { assert } from "chai";

describe("TwitterLogin", () => {
    describe("requestToken", () => {
        it("should request to twitter through TwitterRequestHandler", () => {
            let clientCallbackUrl = "http://localhost:5000/#/twitterSuccess", serverUrl = "http://localhost:5000",
                serverCallbackUrl = "http://localhost:5000/twitter-oauth-callback", userName = "Maharjun";
            let sandbox = sinon.sandbox.create();
            let appWindowMock = new AppWindow();
            let appWindowInstanceMock = sandbox.mock(AppWindow).expects("instance");
            appWindowInstanceMock.returns(appWindowMock);
            let appWindowGetMock = sandbox.mock(appWindowMock).expects("get");
            appWindowGetMock.withExactArgs("serverUrl").returns(serverUrl);
            let twitterRequestHandlerMock = sandbox.mock(TwitterRequestHandler).expects("requestToken");
            twitterRequestHandlerMock.withExactArgs(clientCallbackUrl, serverCallbackUrl, userName).returns(Promise.resolve("response"));
            sandbox.stub(LoginPage, "getUserName").returns(userName);
            return Promise.resolve(TwitterLogin.instance().requestToken()).then(() => {
                appWindowInstanceMock.verify();
                appWindowGetMock.verify();
                twitterRequestHandlerMock.verify();
                sandbox.restore();
            });
        });

        it("should not request to twitter if already authenticated", () => {
            let clientCallbackUrl = "http://localhost:5000/#/twitterSuccess", serverUrl = "http://localhost:5000",
                serverCallbackUrl = "http://localhost:5000/twitter-oauth-callback", userName = "Maharjun";
            let sandbox = sinon.sandbox.create();
            let appWindowMock = new AppWindow();
            let appWindowInstanceMock = sandbox.mock(AppWindow).expects("instance");
            appWindowInstanceMock.returns(appWindowMock);
            let appWindowGetMock = sandbox.mock(appWindowMock).expects("get");
            appWindowGetMock.withExactArgs("serverUrl").returns(serverUrl);
            let twitterRequestHandlerMock = sandbox.mock(TwitterRequestHandler).expects("requestToken");
            twitterRequestHandlerMock.withExactArgs(clientCallbackUrl, serverCallbackUrl, userName).returns(Promise.resolve("response"));
            sandbox.stub(LoginPage, "getUserName").returns(userName);
            return Promise.resolve(TwitterLogin.instance().requestToken()).then(() => {
                appWindowInstanceMock.verify();
                appWindowGetMock.verify();
                twitterRequestHandlerMock.verify();
                sandbox.restore();
            });
        });
    });

    describe("login", () => {
        it("should requestToken if not authenticated", () => {
            let sandbox = sinon.sandbox.create();
            let twitterLogin = new TwitterLogin();
            sandbox.stub(twitterLogin, "isAuthenticated").returns(Promise.resolve(false));
            let requestMock = sandbox.mock(twitterLogin).expects("requestToken").returns(Promise.resolve({ "authenticateUrl": "url" }));
            let windowMock = sandbox.mock(window).expects("open").withArgs("url", "twitterWindow", "location=0,status=0,width=800,height=600");
            return twitterLogin.login().then(() => {
                windowMock.verify();
                requestMock.verify();
                sandbox.restore();
            });
        });

        it("should return successful promise if authenticated already", () => {
            let sandbox = sinon.sandbox.create();
            let twitterLogin = new TwitterLogin();
            sandbox.stub(twitterLogin, "isAuthenticated").returns(Promise.resolve(true));
            let requestMock = sandbox.mock(twitterLogin).expects("requestToken").never();
            return twitterLogin.login().then(() => {
                requestMock.verify();
                sandbox.restore();
            });
        });
    });

    describe("isAuthenticated", () => {
        let facebookTwitterDbMock = null, sandbox = null;
        beforeEach("", () => {
            sandbox = sinon.sandbox.create();
            facebookTwitterDbMock = sandbox.mock(FacebookTwitterDb).expects("getTokenDocument");
        });

        afterEach("", () => {
            facebookTwitterDbMock.verify();
            sandbox.restore();
        });

        it("should return false if socialAccounts document is not present", () => {
            facebookTwitterDbMock.returns(Promise.reject());
            return TwitterLogin.instance().isAuthenticated().then(authenticatedStatus => {
                assert.strictEqual(authenticatedStatus, false)
            });
        });

        it("should return false if twitterAuthenticated is false", () => {
            facebookTwitterDbMock.returns(Promise.resolve({ "_id": "socialAccountId", "facebookExpiredAfter": undefined, "twitterAuthenticated": false }));
            return TwitterLogin.instance().isAuthenticated().then(authenticatedStatus => {
                assert.strictEqual(authenticatedStatus, false)
            });
        });

        it("should return true if twitterAuthenticated", () => {
            facebookTwitterDbMock.returns(Promise.resolve({ "_id": "socialAccountId", "facebookExpiredAfter": undefined, "twitterAuthenticated": true }));
            return TwitterLogin.instance().isAuthenticated().then(authenticatedStatus => {
                assert.strictEqual(authenticatedStatus, true)
            });
        });
    });
});
