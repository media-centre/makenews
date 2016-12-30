/* eslint max-nested-callbacks:0 */

import TwitterRequestHandler from "../../src/js/twitter/TwitterRequestHandler";
import TwitterLogin from "../../src/js/twitter/TwitterLogin";
import AppWindow from "../../src/js/utils/AppWindow";
import UserInfo from "../../src/js/user/UserInfo";
import sinon from "sinon";
import { assert } from "chai";

describe("TwitterLogin", () => {
    describe("requestToken", () => {
        it("should request to twitter through TwitterRequestHandler", () => {
            let clientCallbackUrl = "http://localhost:5000/#/twitterSuccess", serverUrl = "http://localhost:5000",
                serverCallbackUrl = "http://localhost:5000/twitter-oauth-callback";
            let sandbox = sinon.sandbox.create();
            let appWindowMock = new AppWindow();
            let appWindowInstanceMock = sandbox.mock(AppWindow).expects("instance");
            appWindowInstanceMock.returns(appWindowMock);
            let appWindowGetMock = sandbox.mock(appWindowMock).expects("get");
            appWindowGetMock.withExactArgs("serverUrl").returns(serverUrl);
            let twitterRequestHandlerMock = sandbox.mock(TwitterRequestHandler).expects("requestToken");
            twitterRequestHandlerMock.withExactArgs(clientCallbackUrl, serverCallbackUrl).returns(Promise.resolve("response"));
            return Promise.resolve(TwitterLogin.instance().requestToken()).then(() => {
                appWindowInstanceMock.verify();
                appWindowGetMock.verify();
                twitterRequestHandlerMock.verify();
                sandbox.restore();
            });
        });

        it("should not request to twitter if already authenticated", () => {
            let clientCallbackUrl = "http://localhost:5000/#/twitterSuccess", serverUrl = "http://localhost:5000",
                serverCallbackUrl = "http://localhost:5000/twitter-oauth-callback";
            let sandbox = sinon.sandbox.create();
            let appWindowMock = new AppWindow();
            let appWindowInstanceMock = sandbox.mock(AppWindow).expects("instance");
            appWindowInstanceMock.returns(appWindowMock);
            let appWindowGetMock = sandbox.mock(appWindowMock).expects("get");
            appWindowGetMock.withExactArgs("serverUrl").returns(serverUrl);
            let twitterRequestHandlerMock = sandbox.mock(TwitterRequestHandler).expects("requestToken");
            twitterRequestHandlerMock.withExactArgs(clientCallbackUrl, serverCallbackUrl).returns(Promise.resolve("response"));
            return Promise.resolve(TwitterLogin.instance().requestToken()).then(() => {
                appWindowInstanceMock.verify();
                appWindowGetMock.verify();
                twitterRequestHandlerMock.verify();
                sandbox.restore();
            });
        });
    });

    xdescribe("login", () => {
        xit("should requestToken if not authenticated", (done) => {
            let sandbox = sinon.sandbox.create();
            sandbox.stub(TwitterLogin, "isAuthenticated").returns(Promise.resolve(false));
            let windowMock = sandbox.mock(window).expects("open").withArgs("", "twitterWindow", "location=0,status=0,width=800,height=600").returns({ "closed": true });
            let appWindowMock = new AppWindow();
            let appWindowInstanceMock = sandbox.mock(AppWindow).expects("instance");
            appWindowInstanceMock.returns(appWindowMock);
            let appWindowGetMock = sandbox.mock(appWindowMock);
            sandbox.stub(TwitterLogin, "getWaitTime").returns(20); //eslint-disable-line no-magic-numbers
            appWindowGetMock.expects("get").withExactArgs("twitterLoginSucess").returns(true);
            appWindowGetMock.expects("set").withExactArgs("twitterLoginSucess", false);
            TwitterLogin.getInstance().then(twitterLogin => {
                let requestMock = sandbox.mock(twitterLogin).expects("requestToken").returns(Promise.resolve({ "authenticateUrl": "url" }));
                twitterLogin.login().then(() => {
                    windowMock.verify();
                    requestMock.verify();
                    appWindowGetMock.verify();
                    sandbox.restore();
                    done();
                });
            });
        });

        xit("should return successful promise if authenticated already", (done) => {
            let sandbox = sinon.sandbox.create();
            sandbox.stub(TwitterLogin, "isAuthenticated").returns(Promise.resolve(true));
            TwitterLogin.getInstance().then(instance => {
                let requestMock = sandbox.mock(instance).expects("requestToken").never();
                instance.login().then(() => {
                    requestMock.verify();
                    sandbox.restore();
                    done();
                });
            });
        });
    });

    describe("isAuthenticated", () => {
        let facebookTwitterDbMock = null, sandbox = null;
        beforeEach("", () => {
            sandbox = sinon.sandbox.create();
            facebookTwitterDbMock = sandbox.mock(UserInfo).expects("getUserDocument");
        });

        afterEach("", () => {
            facebookTwitterDbMock.verify();
            sandbox.restore();
        });

        it("should return false if user document is not present", () => {
            facebookTwitterDbMock.returns(Promise.reject());
            return TwitterLogin.isAuthenticated().then(authenticatedStatus => {
                assert.strictEqual(authenticatedStatus, false);
            });
        });

        it("should return false if twitterAuthenticated is false", () => {
            facebookTwitterDbMock.returns(Promise.resolve({ "_id": "userInfoId", "facebookExpiredAfter": undefined, "twitterAuthenticated": false })); //eslint-disable-line no-undefined
            return TwitterLogin.isAuthenticated().then(authenticatedStatus => {
                assert.strictEqual(authenticatedStatus, false);
            });
        });

        it("should return true if twitterAuthenticated", () => {
            facebookTwitterDbMock.returns(Promise.resolve({ "_id": "userInfoId", "facebookExpiredAfter": undefined, "twitterAuthenticated": true })); //eslint-disable-line no-undefined
            return TwitterLogin.isAuthenticated().then(authenticatedStatus => {
                assert.strictEqual(authenticatedStatus, true);
            });
        });
    });
});
