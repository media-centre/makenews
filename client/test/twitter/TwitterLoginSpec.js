/* eslint max-nested-callbacks:0 */
"use strict";
import TwitterRequestHandler from "../../src/js/twitter/TwitterRequestHandler.js";
import TwitterLogin from "../../src/js/twitter/TwitterLogin.js";
import AppWindow from "../../src/js/utils/AppWindow.js";
import sinon from "sinon";

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
            twitterRequestHandlerMock.withArgs(clientCallbackUrl, serverCallbackUrl).returns(Promise.resolve("response"));
            return Promise.resolve(TwitterLogin.instance().requestToken()).then(() => {
                appWindowInstanceMock.verify();
                appWindowGetMock.verify();
                twitterRequestHandlerMock.verify();
                sandbox.restore();
            });
        });
    });
});
