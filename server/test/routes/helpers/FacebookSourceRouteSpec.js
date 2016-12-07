import HttpResponseHandler from "../../../../common/src/HttpResponseHandler";
import FacebookSourceRoute from "../../../src/routes/helpers/FacebookSourceRoute";
import { assert } from "chai";
import sinon from "sinon";
import Logger from "../../../src/logging/Logger";
import LogTestHelper from "../../helpers/LogTestHelper";
import FacebookAccessToken from "../../../src/facebook/FacebookAccessToken";
import FacebookRequestHandler from "../../../src/facebook/FacebookRequestHandler";
import { fbSourceTypesToFetch } from "../../../src/util/Constants";
import mockResponse from "../../helpers/MockResponse";

describe("FacebookSourceRoutes", () => {
//
    let sandbox = sinon.sandbox.create();

    before("FacebookSourceRoutes", () => {
        sandbox.stub(Logger, "instance").returns(LogTestHelper.instance());
    });

    after("FacebookSourceRoutes", () => {
        sandbox.restore();
    });

    describe("searchSources", () => {
        let facebookAccessToken = "accessToken", facebookAccessTokenMock = null;
        let keyword = "journalist", type = fbSourceTypesToFetch.page;
        beforeEach("searchSources", () => {
            facebookAccessToken = new FacebookAccessToken();
            facebookAccessTokenMock = sandbox.mock(FacebookAccessToken);
            facebookAccessTokenMock.expects("instance").returns(facebookAccessToken);
        });

        afterEach("searchSources", () => {
            sandbox.restore();
        });

        it("should reject the request if access token is missing", (done) => {
            let response = {
                "status": (status) => {
                    try {
                        assert.strictEqual(HttpResponseHandler.codes.BAD_REQUEST, status);
                        done();
                    } catch(error) {
                        done(error);
                    }
                }
            };

            let facebookRouteHelper = new FacebookSourceRoute({
                "body": {
                    "userName": "user",
                    "type": "user",
                    "keyword": "keyword"
                }
            }, response);

            sandbox.stub(facebookAccessToken, "getAccessToken").withArgs("user").returns(Promise.reject("access token not there"));
            facebookRouteHelper.searchSources();
        });

        it("should reject the request if type is missing", (done) => {
            let response = {
                "status": (status) => {
                    try {
                        assert.strictEqual(HttpResponseHandler.codes.BAD_REQUEST, status);
                        done();
                    } catch(error) {
                        done(error);
                    }
                }
            };

            let facebookRouteHelper = new FacebookSourceRoute({
                "body": { "userName": "something" }
            }, response);
            facebookRouteHelper.searchSources();
        });

        it("should reject the request if invalid type is passed", (done) => {
            let response = {
                "status": (status) => {
                    try {
                        assert.strictEqual(HttpResponseHandler.codes.BAD_REQUEST, status);
                        done();
                    } catch(error) {
                        done(error);
                    }
                }
            };

            let facebookRouteHelper = new FacebookSourceRoute({
                "body": { "userName": "something", "type": "mypage", "keyword": "filt" }
            }, response);
            facebookRouteHelper.searchSources();
        });
        
        it("should reject the request if keyword is missing", (done) => {
            let response = {
                "status": (status) => {
                    try {
                        assert.strictEqual(HttpResponseHandler.codes.BAD_REQUEST, status);
                        done();
                    } catch(error) {
                        done(error);
                    }
                }
            };

            let facebookRouteHelper = new FacebookSourceRoute({
                "body": { "userName": "something", "type": "page" }
            }, response);
            facebookRouteHelper.searchSources();
        });

        it("should throw error if any problem from getting pages from facebook", async () => {

            let response = mockResponse();

            let facebookRouteHelper = new FacebookSourceRoute({
                "body": {
                    "userName": "user",
                    "keyword": keyword,
                    "type": type,
                    "paging": "&offset=50"
                }
            }, response);

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

            await facebookRouteHelper.searchSources();
            assert.strictEqual(response.status(), HttpResponseHandler.codes.BAD_REQUEST);
        });

        it("should get the facebook profiles", (done) => {
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
            let response = {
                "status": (status) => {
                    assert.strictEqual(HttpResponseHandler.codes.OK, status);
                    return response;
                },
                "json": (json) => {
                    try {
                        assert.deepEqual(profiles, json);
                        done();
                    } catch(error) {
                        done(error);
                    }
                }
            };
            let facebookRouteHelper = new FacebookSourceRoute({
                "body": {
                    "userName": "user",
                    "keyword": keyword,
                    "type": "profile",
                    "paging": ""
                }
            }, response);

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

            facebookRouteHelper.searchSources();
        });

        it("should get the facebook pages", (done) => {
            let pages = { "data": [
                { "name": "The Hindu", "id": "163974433696568" },
                { "name": "The Hindu Business Line", "id": "60573550946" },
                { "name": "The Hindu Temple of Canton", "id": "148163135208246" }] };
            let response = {
                "status": (status) => { //eslint-disable-line consistent-return
                    try {
                        assert.strictEqual(HttpResponseHandler.codes.OK, status);
                        return response;
                    } catch(err) {
                        done(err);
                    }
                },
                "json": (json) => {
                    try {
                        assert.deepEqual(pages, json);
                        done();
                    } catch(error) {
                        done(error);
                    }
                }
            };

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
            }, response);

            let accessToken = "token";

            let facebookRequestHandler = new FacebookRequestHandler(accessToken);
            let facebookRequestHandlerMock = sandbox.mock(FacebookRequestHandler);
            facebookRequestHandlerMock.expects("instance").withArgs(accessToken).returns(facebookRequestHandler);

            sandbox.stub(facebookRequestHandler, "fetchSourceUrls")
                .withArgs(params, "").returns(Promise.resolve(pages));
            sandbox.stub(facebookAccessToken, "getAccessToken").withArgs("user").returns(Promise.resolve(accessToken));

            facebookRouteHelper.searchSources();
        });

        it("should get the facebook groups", (done) => {
            type = "group";
            let groups = { "data": [
                { "name": "The Hindu", "id": "163974433696568" },
                { "name": "The Hindu Business Line", "id": "60573550946" },
                { "name": "The Hindu Temple of Canton", "id": "148163135208246" }] };
            let response = {
                "status": (status) => { //eslint-disable-line consistent-return
                    try {
                        assert.strictEqual(HttpResponseHandler.codes.OK, status);
                        return response;
                    } catch(err) {
                        done(err);
                    }
                },
                "json": (json) => {
                    try {
                        assert.deepEqual(groups, json);
                        done();
                    } catch(error) {
                        done(error);
                    }
                }
            };

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
            }, response);

            let accessToken = "token";

            let facebookRequestHandler = new FacebookRequestHandler(accessToken);
            let facebookRequestHandlerMock = sandbox.mock(FacebookRequestHandler);
            facebookRequestHandlerMock.expects("instance").withArgs(accessToken).returns(facebookRequestHandler);

            sandbox.stub(facebookRequestHandler, "fetchSourceUrls")
                .withArgs(params, "&offset=50").returns(Promise.resolve(groups));
            sandbox.stub(facebookAccessToken, "getAccessToken").withArgs("user").returns(Promise.resolve(accessToken));

            facebookRouteHelper.searchSources();
        });
    });
});
