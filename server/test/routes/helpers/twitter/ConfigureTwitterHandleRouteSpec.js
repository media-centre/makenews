import ConfigureTwitterHandleRoute from "./../../../../src/routes/helpers/twitter/ConfigureTwitterHandleRoute";
import { assert } from "chai";
import sinon from "sinon";
import TwitterRequestHandler from "./../../../../src/twitter/TwitterRequestHandler";
import { isRejected } from "./../../../helpers/AsyncTestHelper";

describe("ConfigureTwitterHandleRoute", () => {
    const sandbox = sinon.sandbox.create();

    afterEach("ConfigureTwitterHandleRoute", () => {
        sandbox.restore();
    });

    describe("validate", () => {
        it("should reject the request if handle is missing", () => {
            const configureTwitterPageRoute = new ConfigureTwitterHandleRoute({
                "body": { },
                "cookies": { "AuthSession": "token" }
            }, {});
            assert.strictEqual(configureTwitterPageRoute.validate(), "missing parameters");
        });
    });

    describe("handle", () => {
        const twitterHandle = "testUser";

        it("should throw error if any problem from adding twitter handle to configured list", async() => {
            const configureTwitterHandleRoute = new ConfigureTwitterHandleRoute({
                "body": { twitterHandle },
                "cookies": { "AuthSession": "token" }
            }, {});

            const accessToken = "token";

            const twitterRequestHandler = new TwitterRequestHandler();
            const facebookRequestHandlerMock = sandbox.mock(TwitterRequestHandler);
            facebookRequestHandlerMock.expects("instance").returns(twitterRequestHandler);

            sandbox.stub(twitterRequestHandler, "configureTwitterHandle")
                .withArgs(accessToken, twitterHandle).returns(Promise.reject("response"));

            isRejected(configureTwitterHandleRoute.handle(), "response");
        });

        it("should add the page to configured list", async() => {
            const configureTwitterHandleRoute = new ConfigureTwitterHandleRoute({
                "body": { twitterHandle },
                "cookies": { "AuthSession": "token" }
            }, {});
            const accessToken = "token";
            const twitterRequestHandler = new TwitterRequestHandler();
            const facebookRequestHandlerMock = sandbox.mock(TwitterRequestHandler);
            facebookRequestHandlerMock.expects("instance").returns(twitterRequestHandler);

            sandbox.stub(twitterRequestHandler, "configureTwitterHandle")
                .withArgs(accessToken, twitterHandle).returns(Promise.resolve({ "ok": true }));

            assert.deepEqual(await configureTwitterHandleRoute.handle(), { "ok": true });
        });
    });
});
