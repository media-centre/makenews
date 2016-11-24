import HttpResponseHandler from "../../../../common/src/HttpResponseHandler";
import FacebookSourceRoute from "../../../src/routes/helpers/FacebookSourceRoute";
import { assert } from "chai";
import sinon from "sinon";
import Logger from "../../../src/logging/Logger";
import LogTestHelper from "../../helpers/LogTestHelper";
import FacebookAccessToken from "../../../src/facebook/FacebookAccessToken";
import FacebookRequestHandler from "../../../src/facebook/FacebookRequestHandler";

describe("FacebookSourceRoutes", () => {

    let sandbox = sinon.sandbox.create();

    before("FacebookSourceRoutes", () => {
        sandbox.stub(Logger, "instance").returns(LogTestHelper.instance());
    });

    after("FacebookSourceRoutes", () => {
        sandbox.restore();
    });

    describe("fetchProfiles", () => {
        let facebookAccessToken = null, facebookAccessTokenMock = null;

        beforeEach("fetchProfiles", () => {
            facebookAccessToken = new FacebookAccessToken();
            facebookAccessTokenMock = sandbox.mock(FacebookAccessToken);
            facebookAccessTokenMock.expects("instance").returns(facebookAccessToken);
        });

        afterEach("fetchProfiles", () => {
            sandbox.restore();
        });

        it("should reject the request if user name is missing", (done) => {
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
                "query": {}
            }, response);
            facebookRouteHelper.fetchProfiles();
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
                "query": {
                    "userName": "user"
                }
            }, response);

            sandbox.stub(facebookAccessToken, "getAccessToken").withArgs("user").returns(Promise.reject("access token not there"));
            facebookRouteHelper.fetchProfiles();
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
                "query": {
                    "userName": "user"
                }
            }, response);

            let accessToken = "token";

            let facebookRequestHandler = new FacebookRequestHandler(accessToken);
            let facebookRequestHandlerMock = sandbox.mock(FacebookRequestHandler);
            facebookRequestHandlerMock.expects("instance").withArgs(accessToken).returns(facebookRequestHandler);

            sandbox.stub(facebookRequestHandler, "fetchProfiles").returns(Promise.resolve(profiles));
            sandbox.stub(facebookAccessToken, "getAccessToken").withArgs("user").returns(Promise.resolve(accessToken));

            facebookRouteHelper.fetchProfiles();
        });

        it("should throw error if any problem from getting profiles from facebook", (done) => {
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
                "query": {
                    "userName": "user"
                }
            }, response);

            let accessToken = "token";

            let facebookRequestHandler = new FacebookRequestHandler(accessToken);
            let facebookRequestHandlerMock = sandbox.mock(FacebookRequestHandler);
            facebookRequestHandlerMock.expects("instance").withArgs(accessToken).returns(facebookRequestHandler);

            sandbox.stub(facebookRequestHandler, "fetchProfiles").returns(Promise.reject(response));
            sandbox.stub(facebookAccessToken, "getAccessToken").withArgs("user").returns(Promise.resolve(accessToken));

            facebookRouteHelper.fetchProfiles();
        });
    });

    describe("fetchPages", () => {
        let facebookAccessToken = null, facebookAccessTokenMock = null;

        beforeEach("fetchProfiles", () => {
            facebookAccessToken = new FacebookAccessToken();
            facebookAccessTokenMock = sandbox.mock(FacebookAccessToken);
            facebookAccessTokenMock.expects("instance").returns(facebookAccessToken);
        });

        afterEach("fetchProfiles", () => {
            sandbox.restore();
        });

        it("should reject the request if page name is missing", (done) => {
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
                "query": { "userName": "something" }
            }, response);
            facebookRouteHelper.fetchPages();
        });

        it("should throw error if any problem from getting pages from facebook", (done) => {
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
                "query": {
                    "userName": "user",
                    "pageName": "TheHindu"
                }
            }, response);

            let accessToken = "token";

            let facebookRequestHandler = new FacebookRequestHandler(accessToken);
            let facebookRequestHandlerMock = sandbox.mock(FacebookRequestHandler);
            facebookRequestHandlerMock.expects("instance").withArgs(accessToken).returns(facebookRequestHandler);

            sandbox.stub(facebookRequestHandler, "fetchPages").returns(Promise.reject(response));
            sandbox.stub(facebookAccessToken, "getAccessToken").withArgs("user").returns(Promise.resolve(accessToken));

            facebookRouteHelper.fetchPages();
        });

        it("should get the facebook pages", (done) => {
            let pages = { "data": [
                { "name": "The Hindu", "id": "163974433696568" },
                { "name": "The Hindu Business Line", "id": "60573550946" },
                { "name": "The Hindu Temple of Canton", "id": "148163135208246" }] };
            let response = {
                "status": (status) => {
                    assert.strictEqual(HttpResponseHandler.codes.OK, status);
                    return response;
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
            let facebookRouteHelper = new FacebookSourceRoute({
                "query": {
                    "userName": "user",
                    "pageName": "TheHindu"
                }
            }, response);

            let accessToken = "token";

            let facebookRequestHandler = new FacebookRequestHandler(accessToken);
            let facebookRequestHandlerMock = sandbox.mock(FacebookRequestHandler);
            facebookRequestHandlerMock.expects("instance").withArgs(accessToken).returns(facebookRequestHandler);

            sandbox.stub(facebookRequestHandler, "fetchPages").returns(Promise.resolve(pages));
            sandbox.stub(facebookAccessToken, "getAccessToken").withArgs("user").returns(Promise.resolve(accessToken));

            facebookRouteHelper.fetchPages();
        });
    });
});
