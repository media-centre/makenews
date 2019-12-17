import FacebookSourceRoute from "../../../src/routes/helpers/FacebookSourceRoute";
import { assert } from "chai";
import sinon from "sinon";
import FacebookAccessToken from "../../../src/facebook/FacebookAccessToken";
import FacebookRequestHandler from "../../../src/facebook/FacebookRequestHandler";
import { fbSourceTypesToFetch } from "../../../src/util/Constants";
import { userDetails } from "../../../src/Factory";
import { isRejected } from "../../helpers/AsyncTestHelper";

describe("FacebookSourceRoutes", () => {
    const sandbox = sinon.sandbox.create();
    const keyword = "journalist";
    let type = fbSourceTypesToFetch.page;

    afterEach("FacebookSourceRoutes", () => {
        sandbox.restore();
    });

    describe("validate", () => {
        it("should reject the request if type is missing", () => {
            const facebookRouteHelper = new FacebookSourceRoute({
                "body": { },
                "cookies": { "AuthSession": "token" }
            }, {});
            assert.strictEqual(facebookRouteHelper.validate(), "missing parameters");
        });

        it("should reject the request if invalid type is passed", () => {
            const facebookRouteHelper = new FacebookSourceRoute({
                "body": { "type": "mypage", "keyword": "filt" },
                "cookies": { "AuthSession": "token" }
            }, {});
            assert.strictEqual(facebookRouteHelper.validate(), "invalid type parameter mypage");
        });
        
        it("should reject the request if keyword is missing", () => {
            const facebookRouteHelper = new FacebookSourceRoute({
                "body": { "type": "page" },
                "cookies": { "AuthSession": "token" }
            }, {});
            assert.strictEqual(facebookRouteHelper.validate(), "missing parameters");
        });

    });

    describe("handle", () => {
        let facebookAccessToken = "accessToken";
        let facebookAccessTokenMock = null;

        beforeEach("searchSources", () => {
            facebookAccessToken = new FacebookAccessToken();
            facebookAccessTokenMock = sandbox.mock(FacebookAccessToken);
            facebookAccessTokenMock.expects("instance").returns(facebookAccessToken);
            sandbox.stub(userDetails, "getUser").withArgs("token").returns({ "userName": "user" });

        });
        it("should reject the request if access token is missing", () => {
            const facebookRouteHelper = new FacebookSourceRoute({
                "body": {
                    "type": "user",
                    "keyword": "keyword"
                },
                "cookies": { "AuthSession": "token" }
            }, {});

            sandbox.stub(facebookAccessToken, "getAccessToken").withArgs("user").returns(Promise.reject("access token not there"));
            isRejected(facebookRouteHelper.handle(), "access token not there");
        });

        it("should throw error if any problem from getting pages from facebook", async() => {

            const facebookRouteHelper = new FacebookSourceRoute({
                "body": {
                    "keyword": keyword,
                    "type": type,
                    "paging": "&offset=50"
                },
                "cookies": { "AuthSession": "token" }
            }, {});

            const accessToken = "token";

            const params = {
                "q": keyword,
                "type": type
            };

            const facebookRequestHandler = new FacebookRequestHandler(accessToken);
            const facebookRequestHandlerMock = sandbox.mock(FacebookRequestHandler);
            facebookRequestHandlerMock.expects("instance").withArgs(accessToken).returns(facebookRequestHandler);

            sandbox.stub(facebookAccessToken, "getAccessToken").withArgs("user").returns(Promise.resolve(accessToken));
            sandbox.stub(facebookRequestHandler, "fetchSourceUrls")
                .withArgs(params).returns(Promise.reject("response"));

            isRejected(facebookRouteHelper.handle(), "response");
        });

        it("should get the facebook profiles", async() => {
            const profiles = [{
                "id": "7dsEdsA8",
                "name": "Maha Arjun",
                "picture": {
                    "data": {
                        "is_silhouette": false,
                        "url": "https://scontent.xx.fbcdn.net/v/t1.0-1/c0.19.50.50/p50x50/14595563172_n.jpg"
                    }
                }
            }];

            const facebookRouteHelper = new FacebookSourceRoute({
                "body": {
                    "keyword": keyword,
                    "type": "profile",
                    "paging": ""
                },
                "cookies": { "AuthSession": "token" }
            }, {});

            const accessToken = "token";

            const params = {
                "q": keyword,
                "type": fbSourceTypesToFetch.profile
            };

            const facebookRequestHandler = new FacebookRequestHandler(accessToken);
            const facebookRequestHandlerMock = sandbox.mock(FacebookRequestHandler);
            facebookRequestHandlerMock.expects("instance").withArgs(accessToken).returns(facebookRequestHandler);

            sandbox.stub(facebookRequestHandler, "fetchSourceUrls")
                .withArgs(params, "").returns(Promise.resolve(profiles));
            sandbox.stub(facebookAccessToken, "getAccessToken").withArgs("user").returns(Promise.resolve(accessToken));

            assert.deepEqual(await facebookRouteHelper.handle(), profiles);
        });

        it("should get the facebook pages", async() => {
            const pages = { "data": [
                { "name": "The Hindu", "id": "163974433696568" },
                { "name": "The Hindu Business Line", "id": "60573550946" },
                { "name": "The Hindu Temple of Canton", "id": "148163135208246" }] };

            const params = {
                "q": keyword,
                "type": fbSourceTypesToFetch.page
            };

            const facebookRouteHelper = new FacebookSourceRoute({
                "body": {
                    "keyword": keyword,
                    "type": fbSourceTypesToFetch.page,
                    "paging": ""
                },
                "cookies": { "AuthSession": "token" }
            }, {});

            const accessToken = "token";

            const facebookRequestHandler = new FacebookRequestHandler(accessToken);
            const facebookRequestHandlerMock = sandbox.mock(FacebookRequestHandler);
            facebookRequestHandlerMock.expects("instance").withArgs(accessToken).returns(facebookRequestHandler);

            sandbox.stub(facebookRequestHandler, "fetchSourceUrls")
                .withArgs(params, "").returns(Promise.resolve(pages));
            sandbox.stub(facebookAccessToken, "getAccessToken").withArgs("user").returns(Promise.resolve(accessToken));

            assert.deepEqual(await facebookRouteHelper.handle(), pages);
        });

        it("should get the facebook groups", async() => {
            type = "group";
            const groups = { "data": [
                { "name": "The Hindu", "id": "163974433696568" },
                { "name": "The Hindu Business Line", "id": "60573550946" },
                { "name": "The Hindu Temple of Canton", "id": "148163135208246" }] };

            const params = {
                "q": keyword,
                "type": fbSourceTypesToFetch.group
            };

            const facebookRouteHelper = new FacebookSourceRoute({
                "body": {
                    "keyword": keyword,
                    "type": fbSourceTypesToFetch.group,
                    "paging": "&offset=50"
                },
                "cookies": { "AuthSession": "token" }
            }, {});

            const accessToken = "token";

            const facebookRequestHandler = new FacebookRequestHandler(accessToken);
            const facebookRequestHandlerMock = sandbox.mock(FacebookRequestHandler);
            facebookRequestHandlerMock.expects("instance").withArgs(accessToken).returns(facebookRequestHandler);

            sandbox.stub(facebookRequestHandler, "fetchSourceUrls")
                .withArgs(params, "&offset=50").returns(Promise.resolve(groups));
            sandbox.stub(facebookAccessToken, "getAccessToken").withArgs("user").returns(Promise.resolve(accessToken));

            assert.deepEqual(await facebookRouteHelper.handle(), groups);
        });
    });
});
