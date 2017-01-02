import FacebookSourceRoute from "../../../src/routes/helpers/FacebookSourceRoute";
import { assert } from "chai";
import sinon from "sinon";
import FacebookAccessToken from "../../../src/facebook/FacebookAccessToken";
import FacebookRequestHandler from "../../../src/facebook/FacebookRequestHandler";
import { fbSourceTypesToFetch } from "../../../src/util/Constants";
import { isRejected } from "../../helpers/AsyncTestHelper";

describe("FacebookSourceRoutes", () => {
    let sandbox = sinon.sandbox.create();
    let keyword = "journalist", type = fbSourceTypesToFetch.page;

    afterEach("FacebookSourceRoutes", () => {
        sandbox.restore();
    });

    describe("validate", () => {
        it("should reject the request if type is missing", () => {
            let facebookRouteHelper = new FacebookSourceRoute({
                "body": { "userName": "something" }
            }, {});
            assert.strictEqual(facebookRouteHelper.validate(), "missing parameters");
        });

        it("should reject the request if invalid type is passed", () => {
            let facebookRouteHelper = new FacebookSourceRoute({
                "body": { "userName": "something", "type": "mypage", "keyword": "filt" }
            }, {});
            assert.strictEqual(facebookRouteHelper.validate(), "invalid type parameter mypage");
        });
        
        it("should reject the request if keyword is missing", () => {
            let facebookRouteHelper = new FacebookSourceRoute({
                "body": { "userName": "something", "type": "page" }
            }, {});
            assert.strictEqual(facebookRouteHelper.validate(), "missing parameters");
        });

    });

    describe("handle", () => {
        let facebookAccessToken = "accessToken", facebookAccessTokenMock = null;

        beforeEach("searchSources", () => {
            facebookAccessToken = new FacebookAccessToken();
            facebookAccessTokenMock = sandbox.mock(FacebookAccessToken);
            facebookAccessTokenMock.expects("instance").returns(facebookAccessToken);
        });
        it("should reject the request if access token is missing", () => {
            let facebookRouteHelper = new FacebookSourceRoute({
                "body": {
                    "userName": "user",
                    "type": "user",
                    "keyword": "keyword"
                }
            }, {});

            sandbox.stub(facebookAccessToken, "getAccessToken").withArgs("user").returns(Promise.reject("access token not there"));
            isRejected(facebookRouteHelper.handle(), "access token not there");
        });

        it("should throw error if any problem from getting pages from facebook", async () => {

            let facebookRouteHelper = new FacebookSourceRoute({
                "body": {
                    "userName": "user",
                    "keyword": keyword,
                    "type": type,
                    "paging": "&offset=50"
                }
            }, {});

            let accessToken = "token";

            let params = {
                "q": keyword,
                "type": type
            };

            let facebookRequestHandler = new FacebookRequestHandler(accessToken);
            let facebookRequestHandlerMock = sandbox.mock(FacebookRequestHandler);
            facebookRequestHandlerMock.expects("instance").withArgs(accessToken).returns(facebookRequestHandler);

            sandbox.stub(facebookAccessToken, "getAccessToken").withArgs("user").returns(Promise.resolve(accessToken));
            sandbox.stub(facebookRequestHandler, "fetchSourceUrls")
                .withArgs(params).returns(Promise.reject("response"));

            isRejected(facebookRouteHelper.handle(), "response");
        });

        it("should get the facebook profiles", async () => {
            let profiles = [{
                "id": "7dsEdsA8",
                "name": "Maha Arjun",
                "picture": {
                    "data": {
                        "is_silhouette": false,
                        "url": "https://scontent.xx.fbcdn.net/v/t1.0-1/c0.19.50.50/p50x50/14595563172_n.jpg"
                    }
                }
            }];

            let facebookRouteHelper = new FacebookSourceRoute({
                "body": {
                    "userName": "user",
                    "keyword": keyword,
                    "type": "profile",
                    "paging": ""
                }
            }, {});

            let accessToken = "token";

            let params = {
                "q": keyword,
                "type": fbSourceTypesToFetch.profile
            };

            let facebookRequestHandler = new FacebookRequestHandler(accessToken);
            let facebookRequestHandlerMock = sandbox.mock(FacebookRequestHandler);
            facebookRequestHandlerMock.expects("instance").withArgs(accessToken).returns(facebookRequestHandler);

            sandbox.stub(facebookRequestHandler, "fetchSourceUrls")
                .withArgs(params, "").returns(Promise.resolve(profiles));
            sandbox.stub(facebookAccessToken, "getAccessToken").withArgs("user").returns(Promise.resolve(accessToken));

            assert.deepEqual(await facebookRouteHelper.handle(), profiles);
        });

        it("should get the facebook pages", async () => {
            let pages = { "data": [
                { "name": "The Hindu", "id": "163974433696568" },
                { "name": "The Hindu Business Line", "id": "60573550946" },
                { "name": "The Hindu Temple of Canton", "id": "148163135208246" }] };

            let params = {
                "q": keyword,
                "type": fbSourceTypesToFetch.page
            };

            let facebookRouteHelper = new FacebookSourceRoute({
                "body": {
                    "userName": "user",
                    "keyword": keyword,
                    "type": fbSourceTypesToFetch.page,
                    "paging": ""
                }
            }, {});

            let accessToken = "token";

            let facebookRequestHandler = new FacebookRequestHandler(accessToken);
            let facebookRequestHandlerMock = sandbox.mock(FacebookRequestHandler);
            facebookRequestHandlerMock.expects("instance").withArgs(accessToken).returns(facebookRequestHandler);

            sandbox.stub(facebookRequestHandler, "fetchSourceUrls")
                .withArgs(params, "").returns(Promise.resolve(pages));
            sandbox.stub(facebookAccessToken, "getAccessToken").withArgs("user").returns(Promise.resolve(accessToken));

            assert.deepEqual(await facebookRouteHelper.handle(), pages);
        });

        it("should get the facebook groups", async () => {
            type = "group";
            let groups = { "data": [
                { "name": "The Hindu", "id": "163974433696568" },
                { "name": "The Hindu Business Line", "id": "60573550946" },
                { "name": "The Hindu Temple of Canton", "id": "148163135208246" }] };

            let params = {
                "q": keyword,
                "type": fbSourceTypesToFetch.group
            };

            let facebookRouteHelper = new FacebookSourceRoute({
                "body": {
                    "userName": "user",
                    "keyword": keyword,
                    "type": fbSourceTypesToFetch.group,
                    "paging": "&offset=50"
                }
            }, {});

            let accessToken = "token";

            let facebookRequestHandler = new FacebookRequestHandler(accessToken);
            let facebookRequestHandlerMock = sandbox.mock(FacebookRequestHandler);
            facebookRequestHandlerMock.expects("instance").withArgs(accessToken).returns(facebookRequestHandler);

            sandbox.stub(facebookRequestHandler, "fetchSourceUrls")
                .withArgs(params, "&offset=50").returns(Promise.resolve(groups));
            sandbox.stub(facebookAccessToken, "getAccessToken").withArgs("user").returns(Promise.resolve(accessToken));

            assert.deepEqual(await facebookRouteHelper.handle(), groups);
        });
    });
});
