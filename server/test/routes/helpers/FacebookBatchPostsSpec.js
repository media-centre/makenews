/* eslint no-unused-expressions:0, max-nested-callbacks: [2, 5] */

import HttpResponseHandler from "../../../../common/src/HttpResponseHandler";
import FacebookBatchPosts from "../../../src/routes/helpers/FacebookBatchPosts";
import FacebookRequestHandler from "../../../src/facebook/FacebookRequestHandler";
import FacebookAccessToken from "../../../src/facebook/FacebookAccessToken";
import Logger from "../../../src/logging/Logger";
import LogTestHelper from "../../helpers/LogTestHelper";
import sinon from "sinon";
import { assert } from "chai";


describe("FacebookBatchPosts", () => {
    describe("handle", () => {
        const zero = 0, one = 1;

        let sandbox = null;
        let accessToken = null, userName = "test1";
        beforeEach("handle", () => {
            sandbox = sinon.sandbox.create();
            sandbox.stub(Logger, "instance").returns(LogTestHelper.instance());
            accessToken = "test_access_token";
        });

        afterEach("handle", () => {
            sandbox.restore();
        });

        it("should fetch for all the pages passed", (done) => {
            let requestData = {
                "body": {
                    "data": [{
                        "url": "http://facebook.com/TOI",
                        "id": "6E4B3A-5B3E-15CD-95CB-7E9D89857316",
                        "timestamp": "2016-01-10T10:58:18+00:00"
                    },
                        {
                            "url": "http://facebook.com/hindu",
                            "id": "163974433696568_958425464251457",
                            "timestamp": "2016-01-10T10:58:18+00:00"
                        }],
                    "userName": userName
                }
            };

            let urlResponse1 = [{
                "message": "Test message 1",
                "created_time": "2015-12-11T08:02:59+0000",
                "id": "163974433696568_958425464251457"
            }];
            let urlResponse2 = [{
                "message": "Test message 2",
                "created_time": "2015-12-11T08:02:59+0000",
                "id": "163974433696568_958425464251457"
            }];

            let responseData = {
                "6E4B3A-5B3E-15CD-95CB-7E9D89857316": urlResponse1,
                "163974433696568_958425464251457": urlResponse2
            };

            let response = {
                "status": (status) => {
                    assert.strictEqual(HttpResponseHandler.codes.OK, status);
                    return response;
                },
                "json": (json) => {
                    assert.deepEqual({ "posts": responseData }, json);
                    done();
                }
            };

            let facebookAccessToken = new FacebookAccessToken();
            let facebookAccessTokenMock = sandbox.mock(FacebookAccessToken);
            facebookAccessTokenMock.expects("instance").returns(facebookAccessToken);
            sandbox.stub(facebookAccessToken, "getAccessToken").withArgs(userName).returns(Promise.resolve(accessToken));

            let facebookRequestHandlerInstance = new FacebookRequestHandler(accessToken);

            let facebookRequestHandlerMock = sandbox.mock(FacebookRequestHandler).expects("instance");
            facebookRequestHandlerMock.withArgs(accessToken).returns(facebookRequestHandlerInstance);

            let fetchFacebookFeedRequestStub = sandbox.stub(facebookRequestHandlerInstance, "pagePosts");
            fetchFacebookFeedRequestStub.withArgs(requestData.body.data[zero].url, "posts", { "since": "2016-01-10T10:58:18.000Z" }).returns(Promise.resolve(urlResponse1));
            fetchFacebookFeedRequestStub.withArgs(requestData.body.data[one].url, "posts", { "since": "2016-01-10T10:58:18.000Z" }).returns(Promise.resolve(urlResponse2));

            let next = {};
            new FacebookBatchPosts(requestData, response, next).handle();

        });

        it("should respond for failed requests", (done) => {
            let requestData = {
                "body": {
                    "data": [{
                        "url": "http://facebook.com/TOI",
                        "id": "6E4B3A-5B3E-15CD-95CB-7E9D89857316",
                        "timestamp": "2016-01-10T10:58:18+00:00"
                    },
                        {
                            "url": "http://facebook.com/hindu",
                            "id": "163974433696568_958425464251457",
                            "timestamp": "2016-01-10T10:58:18+00:00"
                        }],
                    "userName": userName
                }
            };

            let urlResponse1 = [{
                "message": "Test message 1",
                "created_time": "2015-12-11T08:02:59+0000",
                "id": "163974433696568_958425464251457"
            }];

            let responseData = {
                "6E4B3A-5B3E-15CD-95CB-7E9D89857316": urlResponse1,
                "163974433696568_958425464251457": "failed"
            };

            let response = {
                "status": (status) => {
                    assert.strictEqual(HttpResponseHandler.codes.OK, status);
                    return response;
                },
                "json": (json) => {
                    assert.deepEqual({ "posts": responseData }, json);
                    done();
                }
            };

            let facebookAccessToken = new FacebookAccessToken();
            let facebookAccessTokenMock = sandbox.mock(FacebookAccessToken);
            facebookAccessTokenMock.expects("instance").returns(facebookAccessToken);
            sandbox.stub(facebookAccessToken, "getAccessToken").withArgs(userName).returns(Promise.resolve(accessToken));

            let facebookRequestHandlerInstance = new FacebookRequestHandler(accessToken);

            let facebookRequestHandlerMock = sandbox.mock(FacebookRequestHandler).expects("instance");
            facebookRequestHandlerMock.withArgs(accessToken).returns(facebookRequestHandlerInstance);

            let fetchFacebookFeedRequestStub = sandbox.stub(facebookRequestHandlerInstance, "pagePosts");
            fetchFacebookFeedRequestStub.withArgs(requestData.body.data[zero].url).returns(Promise.resolve(urlResponse1));
            fetchFacebookFeedRequestStub.withArgs(requestData.body.data[one].url).returns(Promise.reject("error"));

            let next = {};
            new FacebookBatchPosts(requestData, response, next).handle();
        });
    });
});

