import TwitterOauthCallbackRoute from "../../../src/routes/helpers/TwitterOauthCallbackRoute";
import TwitterLogin from "../../../src/twitter/TwitterLogin";
import RouteLogger from "../../../src/routes/RouteLogger";
import LogTestHelper from "../../helpers/LogTestHelper";
import sinon from "sinon";
import { assert } from "chai";

describe("TwitterOauthCallbackRoute", () => {

    describe("handle", () => {
        let sandbox = null;
        beforeEach("beforeEach", () => {
            sandbox = sinon.sandbox.create();
            sandbox.stub(RouteLogger, "instance").returns(LogTestHelper.instance());
        });

        afterEach("afterEach", () => {
            sandbox.restore();
        });

        it("should return the clientCallbackUrl on success", async() => {
            const twitterLogin = new TwitterLogin();
            const oauthToken = "oauth_token", oauthVerifier = "oauth_verifier", clientRedirectUrl = "clientRedirectUrl";
            const twitterLoginMock = sandbox.mock(TwitterLogin).expects("instance").withArgs({ "previouslyFetchedOauthToken": oauthToken, "accessToken": "test_token" }).returns(Promise.resolve(twitterLogin));
            const accessTokenFromTwitterMock = sandbox.mock(twitterLogin).expects("accessTokenFromTwitter").withArgs(oauthVerifier).returns(Promise.resolve(clientRedirectUrl));
            const response = { "redirect": () => {} };
            const request = {
                "query": {
                    "oauth_token": oauthToken,
                    "oauth_verifier": oauthVerifier
                },
                "cookies": {
                    "AuthSession": "test_token"
                }
            };
            const responseMock = sandbox.mock(response);
            responseMock.expects("redirect").withArgs(clientRedirectUrl);
            const twitterOauthCallbackRoute = new TwitterOauthCallbackRoute(request, response);
            await Promise.resolve(twitterOauthCallbackRoute.handle());
            twitterLoginMock.verify();
            accessTokenFromTwitterMock.verify();
            responseMock.verify();
        });

        it("should redirect to /twitterFailed route if the query param denied is present", () => {
            const request = {
                "query": { "denied": "Xevjwuks" },
                "cookies": { "AuthSession": "test_token" },
                "secure": true,
                "headers": { "host": "localhost" }
            };

            const redirectSpy = sandbox.spy();
            const response = {
                "redirect": redirectSpy
            };

            const twitterOauthCallBack = new TwitterOauthCallbackRoute(request, response);
            twitterOauthCallBack.handle();

            assert.isTrue(redirectSpy.calledWith("https://localhost/#/twitterFailed"));
        });
    });
});
