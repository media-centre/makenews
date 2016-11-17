import HttpResponseHandler from "../../../../common/src/HttpResponseHandler";
import FacebookProfilesRoute from "../../../src/routes/helpers/FacebookProfilesRoute";
import { assert } from "chai";
import sinon from "sinon";
import Logger from "../../../src/logging/Logger";
import LogTestHelper from "../../helpers/LogTestHelper";
import FacebookAccessToken from "../../../src/facebook/FacebookAccessToken";
import FacebookRequestHandler from "../../../src/facebook/FacebookRequestHandler";

describe("FacebookProfilesRoutes", () => {

    let sandbox = sinon.sandbox.create();

    before("FacebookProfilesRoutes", () => {
        sandbox.stub(Logger, "instance").returns(LogTestHelper.instance());
    });

    after("FacebookProfilesRoute", () => {
        sandbox.restore();
    });

    describe("handle", () => {
        let facebookAccessToken = null, facebookAccessTokenMock = null;

        beforeEach("handle", () => {
            facebookAccessToken = new FacebookAccessToken();
            facebookAccessTokenMock = sandbox.mock(FacebookAccessToken);
            facebookAccessTokenMock.expects("instance").returns(facebookAccessToken);
        });

        afterEach("handle", () => {
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

            let facebookRouteHelper = new FacebookProfilesRoute({
                "query": {}
            }, response);
            facebookRouteHelper.handle();
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

            let facebookRouteHelper = new FacebookProfilesRoute({
                "query": {
                    "userName": "user"
                }
            }, response);

            sandbox.stub(facebookAccessToken, "getAccessToken").withArgs("user").returns(Promise.reject("access token not there"));
            facebookRouteHelper.handle();
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
                        assert.deepEqual({ "profiles": profiles }, json);
                        done();
                    } catch(error) {
                        done(error);
                    }
                }
            };
            let facebookRouteHelper = new FacebookProfilesRoute({
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

            facebookRouteHelper.handle();
        });

        it("should through error if any problem from getting profiles from facebook", (done) => {
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
            let facebookRouteHelper = new FacebookProfilesRoute({
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

            facebookRouteHelper.handle();
        });
    });
});
