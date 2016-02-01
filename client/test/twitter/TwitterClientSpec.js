/* eslint max-nested-callbacks:0 */
"use strict";
import TwitterClient from "../../src/js/twitter/TwitterClient.js";
import AjaxClient from "../../src/js/utils/AjaxClient.js";
import { expect } from "chai";
import sinon from "sinon";

describe("TwitterClient", () => {
    describe("requestToken", () => {
        it("should get oauth_token from twitter", () => {
            let response = { "authorizeUrl" : "url" };
            let clientCallbackUrl = "clientCallbackUrl", serverCallbackUrl = "serverCallbackUrl";
            let query = { "clientCallbackUrl": clientCallbackUrl, "serverCallbackUrl": serverCallbackUrl }
            let sandbox = sinon.sandbox.create();
            let ajaxMock = new AjaxClient("/twitter-request-token");
            let ajaxInstanceMock = sandbox.mock(AjaxClient).expects("instance");
            ajaxInstanceMock.withArgs("/twitter-request-token").returns(ajaxMock);
            let ajaxGetMock = sandbox.mock(ajaxMock).expects("get");
            ajaxGetMock.withExactArgs(query).returns(Promise.resolve(response));
            return Promise.resolve(TwitterClient.instance().requestToken(clientCallbackUrl, serverCallbackUrl)).then((authUrlObj) => {
                expect(authUrlObj.authorizeUrl).to.eq("url");
                ajaxInstanceMock.verify();
                ajaxGetMock.verify();
                sandbox.restore();
            });
        });
    });
});
