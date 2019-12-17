/*eslint max-nested-callbacks:0*/

import HttpResponseHandler from "../../../../common/src/HttpResponseHandler";
import TwitterRequestTokenRoute from "../../../src/routes/helpers/TwitterRequestTokenRoute";
import TwitterLogin from "../../../src/twitter/TwitterLogin";
import sinon from "sinon";

describe("TwitterRequestTokenRouteSpec", () => {
    describe("handle", () => {
        let sandbox = null;
        beforeEach("beforeEach", () => {
            sandbox = sinon.sandbox.create();
        });

        afterEach("afterEach", () => {
            sandbox.restore();
        });

        it("should redirect to authenticate with requestToken", () => {
            const twitterLogin = new TwitterLogin();
            const token = "token";
            const expectedUrl = "https://api.twitter.com/oauth/authenticate?oauth_token=" + token;
            const clientCallbackUrl = "clientUrl";
            const serverCallbackUrl = "serverUrl";
            twitterLogin.oauthToken = token;
            const twitterLoginMock = sandbox.mock(TwitterLogin).expects("instance").withArgs({ "serverCallbackUrl": serverCallbackUrl, "clientCallbackUrl": clientCallbackUrl }).returns(Promise.resolve(twitterLogin));
            const response = { "status": () => {}, "json": () => {} };
            const request = {
                "query": {
                    "clientCallbackUrl": clientCallbackUrl,
                    "serverCallbackUrl": serverCallbackUrl,
                    "userName": "Maharjun"
                }
            };
            const responseMock = sandbox.mock(response);
            responseMock.expects("status").withArgs(HttpResponseHandler.codes.OK);
            responseMock.expects("json").withArgs({ "authenticateUrl": expectedUrl });
            const twitterReqTokenRoute = new TwitterRequestTokenRoute(request, response);
            return Promise.resolve(twitterReqTokenRoute.handle()).then(() => {
                twitterLoginMock.verify();
                responseMock.verify();
            });
        });
    });
});
