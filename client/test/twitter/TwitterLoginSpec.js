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
            const clientCallbackUrl = "http://localhost:5000/#/twitterSuccess";
            const serverUrl = "http://localhost:5000";
            const serverCallbackUrl = "http://localhost:5000/twitter-oauth-callback";
            const appWindowMock = new AppWindow();
            const appWindowInstanceMock = sandbox.mock(AppWindow).expects("instance");
            appWindowInstanceMock.returns(appWindowMock);
            const appWindowGetMock = sandbox.mock(appWindowMock).expects("get");
            appWindowGetMock.withExactArgs("serverUrl").returns(serverUrl);
            const ajaxInstance = { "get": () => {} };
            const ajaxMock = sandbox.mock(AjaxClient).expects("instance");
            ajaxMock.withArgs("/twitter-request-token").returns(ajaxInstance);
            const ajaxInstanceMock = sandbox.mock(ajaxInstance).expects("get");
            ajaxInstanceMock.withExactArgs({ clientCallbackUrl, serverCallbackUrl }).returns(Promise.resolve("response"));
            return Promise.resolve(TwitterLogin.instance().requestToken()).then(() => {
                appWindowGetMock.verify();
                ajaxInstanceMock.verify();
            });
        });
    });
});
