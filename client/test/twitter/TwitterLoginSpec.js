/* eslint max-nested-callbacks:0 */

import TwitterLogin from "../../src/js/twitter/TwitterLogin";
import AppWindow from "../../src/js/utils/AppWindow";
import AjaxClient from "../../src/js/utils/AjaxClient";
import sinon from "sinon";

describe("TwitterLogin", () => {
    let sandbox = null;
    beforeEach("TwitterLogin", () => {
        sandbox = sinon.sandbox.create();
    });

    afterEach("TwitterLogin", () => {
        sandbox.restore();
    });

    describe("requestToken", () => {
        it("should not request to twitter if already authenticated", () => {
            let clientCallbackUrl = "http://localhost:5000/#/twitterSuccess", serverUrl = "http://localhost:5000",
                serverCallbackUrl = "http://localhost:5000/twitter-oauth-callback";
            let appWindowMock = new AppWindow();
            let appWindowInstanceMock = sandbox.mock(AppWindow).expects("instance");
            appWindowInstanceMock.returns(appWindowMock);
            let appWindowGetMock = sandbox.mock(appWindowMock).expects("get");
            appWindowGetMock.withExactArgs("serverUrl").returns(serverUrl);
            let ajaxInstance = { "get": () => {} };
            let ajaxMock = sandbox.mock(AjaxClient).expects("instance");
            ajaxMock.withArgs("/twitter-request-token").returns(ajaxInstance);
            let ajaxInstanceMock = sandbox.mock(ajaxInstance).expects("get");
            ajaxInstanceMock.withExactArgs({ clientCallbackUrl, serverCallbackUrl }).returns(Promise.resolve("response"));
            return Promise.resolve(TwitterLogin.instance().requestToken()).then(() => {
                appWindowGetMock.verify();
                ajaxInstanceMock.verify();
            });
        });
    });
});
