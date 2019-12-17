import ConfigureFacebookPageRoute from "./../../../../src/routes/helpers/facebook/ConfigureFacebookPageRoute";
import { assert } from "chai";
import sinon from "sinon";
import FacebookAccessToken from "./../../../../src/facebook/FacebookAccessToken";
import FacebookRequestHandler from "./../../../../src/facebook/FacebookRequestHandler";
import { userDetails } from "./../../../../src/Factory";
import { isRejected } from "./../../../helpers/AsyncTestHelper";

describe("ConfigureFacebookPageRoute", () => {
    const sandbox = sinon.sandbox.create();

    afterEach("ConfigureFacebookPageRoute", () => {
        sandbox.restore();
    });

    describe("validate", () => {
        it("should reject the request if type is missing", () => {
            const configureFbPageRoute = new ConfigureFacebookPageRoute({
                "body": { },
                "cookies": { "AuthSession": "token" }
            }, {});
            assert.strictEqual(configureFbPageRoute.validate(), "missing parameters");
        });
    });

    describe("handle", () => {
        let facebookAccessToken = "accessToken";
        let facebookAccessTokenMock = null;
        const pageUrl = "https://www.facebook.com/icc";

        beforeEach("handle", () => {
            facebookAccessToken = new FacebookAccessToken();
            facebookAccessTokenMock = sandbox.mock(FacebookAccessToken);
            facebookAccessTokenMock.expects("instance").returns(facebookAccessToken);
            sandbox.stub(userDetails, "getUser").withArgs("token").returns({ "userName": "user" });

        });
        it("should reject the request if access token is missing", () => {
            const configureFbPageRoute = new ConfigureFacebookPageRoute({
                "body": { pageUrl },
                "cookies": { "AuthSession": "token" }
            }, {});

            sandbox.stub(facebookAccessToken, "getAccessToken").withArgs("user").returns(Promise.reject("access token not there"));
            isRejected(configureFbPageRoute.handle(), "access token not there");
        });

        it("should throw error if any problem from adding page to configured list", async() => {
            const configureFbPageRoute = new ConfigureFacebookPageRoute({
                "body": { pageUrl },
                "cookies": { "AuthSession": "token" }
            }, {});

            const accessToken = "token";

            const facebookRequestHandler = new FacebookRequestHandler(accessToken);
            const facebookRequestHandlerMock = sandbox.mock(FacebookRequestHandler);
            facebookRequestHandlerMock.expects("instance").withArgs(accessToken).returns(facebookRequestHandler);

            sandbox.stub(facebookAccessToken, "getAccessToken").withArgs("user").returns(Promise.resolve(accessToken));
            sandbox.stub(facebookRequestHandler, "configureFacebookPage")
                .withArgs(pageUrl, "token").returns(Promise.reject("response"));

            isRejected(configureFbPageRoute.handle(), "response");
        });

        it("should add the page to configured list", async() => {
            const configureFbPageRoute = new ConfigureFacebookPageRoute({
                "body": { pageUrl },
                "cookies": { "AuthSession": "token" }
            }, {});
            const accessToken = "token";
            const facebookRequestHandler = new FacebookRequestHandler(accessToken);
            const facebookRequestHandlerMock = sandbox.mock(FacebookRequestHandler);
            facebookRequestHandlerMock.expects("instance").withArgs(accessToken).returns(facebookRequestHandler);

            sandbox.stub(facebookRequestHandler, "configureFacebookPage")
                .withArgs(pageUrl, accessToken).returns(Promise.resolve({ "ok": true }));
            sandbox.stub(facebookAccessToken, "getAccessToken").withArgs("user").returns(Promise.resolve(accessToken));

            assert.deepEqual(await configureFbPageRoute.handle(), { "ok": true });
        });
    });
});
