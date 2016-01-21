/* eslint no-unused-expressions:0, max-nested-callbacks: [2, 5] */
"use strict";
import HttpResponseHandler from "../../../../common/src/HttpResponseHandler.js";
import FacebookRouteHelper from "../../../src/routes/helpers/FacebookRouteHelper.js";
import FacebookRequestHandler from "../../../src/facebook/FacebookRequestHandler.js";
import FacebookAccessToken from "../../../src/facebook/FacebookAccessToken.js";
import sinon from "sinon";
import { assert } from "chai";


describe("FacebookRouteHelper", () => {
    let request = null, facebookRequestHandler = null, accessToken = null, webUrl = null, posts = null, userName = "test1";
    before("FacebookRouteHelper", () => {
        accessToken = "test_access_token";
        webUrl = "https://facebook.com/testpage";
        request = {
            "query": {
                "webUrl": webUrl,
                "accessToken": accessToken,
                "since": "2015-12-21T21:47:11+00:00",
                "userName": userName
            }
        };
    });

    describe("pageRouter", () => {
        let facebookRequestHandlerInstanceMock = null, facebookAccessTokenMock = null, facebookAccessToken = null;
        beforeEach("pageRouter", () => {
            posts = [
                {
                    "message": "Lammasingi village in #AndhraPradesh is a meteorological oddity. \n\nFind out how - bit.ly/1Y19P17",
                    "created_time": "2015-12-11T08:02:59+0000",
                    "id": "163974433696568_958425464251457"
                }];
            facebookRequestHandler = new FacebookRequestHandler(accessToken);
            facebookRequestHandlerInstanceMock = sinon.mock(FacebookRequestHandler).expects("instance");
            facebookAccessToken = new FacebookAccessToken();
            facebookAccessTokenMock = sinon.mock(FacebookAccessToken);
            facebookAccessTokenMock.expects("instance").returns(facebookAccessToken);
        });

        afterEach("pageRouter", () => {
            FacebookRequestHandler.instance.restore();
            facebookAccessTokenMock.restore();
        });

        it("should set the the facebook feeds on response", (done) => {
            sinon.stub(facebookAccessToken, "getAccessToken").withArgs(userName).returns(Promise.resolve(accessToken));
            facebookRequestHandlerInstanceMock.withArgs(accessToken).returns(facebookRequestHandler);
            let facebookRequestHandlerStub = sinon.stub(facebookRequestHandler, "pagePosts");
            let response = {
                "status": (status) => {
                    assert.strictEqual(HttpResponseHandler.codes.OK, status);
                    return response;
                },
                "json": (json) => {
                    assert.deepEqual({ "posts": posts }, json);
                    facebookRequestHandlerInstanceMock.verify();
                    facebookAccessTokenMock.verify();
                    done();
                }
            };

            facebookRequestHandlerStub.withArgs(webUrl).returns(Promise.resolve(posts));

            let facebookRouteHelper = new FacebookRouteHelper(request, response);
            facebookRouteHelper.pageRouter();
        });

        it("should set the error on the response in case if feeds can not be fetched from facebook", (done) => {
            sinon.stub(facebookAccessToken, "getAccessToken").withArgs(userName).returns(Promise.resolve(accessToken));
            facebookRequestHandlerInstanceMock.withArgs(accessToken).returns(facebookRequestHandler);
            let facebookRequestHandlerStub = sinon.stub(facebookRequestHandler, "pagePosts");
            let error = {
                "message": "Error validating access token: Session has expired on Thursday, 10-Dec-15 04:00:00 PST. The current time is Thursday, 10-Dec-15 20:23:54 PST.",
                "type": "OAuthException",
                "code": 190,
                "error_subcode": 463,
                "fbtrace_id": "AWpk5h2ceG6"
            };
            let response = {
                "status": (status) => {
                    assert.strictEqual(HttpResponseHandler.codes.INTERNAL_SERVER_ERROR, status);
                    return response;
                },
                "json": (json) => {
                    assert.deepEqual(error, json);
                    facebookRequestHandlerInstanceMock.verify();
                    facebookAccessTokenMock.verify();
                    done();
                }
            };

            facebookRequestHandlerStub.withArgs(webUrl).returns(Promise.reject(error));

            let facebookRouteHelper = new FacebookRouteHelper(request, response);
            facebookRouteHelper.pageRouter();
        });

        it("should get the feeds from time since option", (done) => {
            let timSinceRequest = {
                "query": {
                    "webUrl": webUrl,
                    "accessToken": accessToken,
                    "since": "2015-12-21T21:47:11+00:00",
                    "userName": userName
                }
            };

            sinon.stub(facebookAccessToken, "getAccessToken").withArgs(userName).returns(Promise.resolve(accessToken));
            facebookRequestHandlerInstanceMock.withArgs(accessToken).returns(facebookRequestHandler);
            let facebookRequestHandlerPagePostsMock = sinon.mock(facebookRequestHandler).expects("pagePosts");
            facebookRequestHandlerPagePostsMock.withArgs(webUrl, { "since": "2015-12-21T21:47:11.000Z" }).returns(Promise.resolve(posts));

            let response = {
                "status": (status) => {
                    assert.strictEqual(HttpResponseHandler.codes.OK, status);
                    return response;
                },
                "json": (json) => {
                    assert.deepEqual({ "posts": posts }, json);
                    facebookRequestHandlerInstanceMock.verify();
                    facebookAccessTokenMock.verify();
                    done();
                }
            };

            let facebookRouteHelper = new FacebookRouteHelper(timSinceRequest, response);
            facebookRouteHelper.pageRouter();

        });

        it("should reject the request if web url is missing", (done) => {
            let response = {
                "status": (status) => {
                    assert.strictEqual(HttpResponseHandler.codes.BAD_REQUEST, status);
                    done();
                },
                "json": (json) => { //eslint-disable-line

                }
            };

            let facebookRouteHelper = new FacebookRouteHelper({
                "query": {
                    "accessToken": accessToken,
                    "since": "2015-12-21T21:47:11+00:00",
                    "userName": userName
                }
            }, response);
            facebookRouteHelper.pageRouter();
        });

        it("should reject the request if access token is missing", (done) => {
            let response = {
                "status": (status) => {
                    assert.strictEqual(HttpResponseHandler.codes.INTERNAL_SERVER_ERROR, status);
                    done();
                },
                "json": (json) => { //eslint-disable-line

                }
            };

            let facebookRouteHelper = new FacebookRouteHelper({
                "query": {
                    "webUrl": webUrl,
                    "since": "2015-12-21T21:47:11+00:00",
                    "userName": userName
                }
            }, response);
            sinon.stub(facebookAccessToken, "getAccessToken").withArgs(userName).returns(Promise.reject("access token not there"));
            facebookRouteHelper.pageRouter();
        });

        it("should reject the request if since date is invalid", (done) => {
            let response = {
                "status": (status) => {
                    assert.strictEqual(HttpResponseHandler.codes.BAD_REQUEST, status);
                    done();
                },
                "json": (json) => { //eslint-disable-line

                }
            };

            let facebookRouteHelper = new FacebookRouteHelper({
                "query": {
                    "accessToken": accessToken,
                    "webUrl": webUrl,
                    "since": "2015-13-2121:47:11+00:00"
                }
            }, response);
            facebookRouteHelper.pageRouter();
        });

        it("should reject the request if user name is missing", (done) => {
            let response = {
                "status": (status) => {
                    assert.strictEqual(HttpResponseHandler.codes.BAD_REQUEST, status);
                    done();
                },
                "json": (json) => { //eslint-disable-line

                }
            };

            let facebookRouteHelper = new FacebookRouteHelper({
                "query": {
                    "webUrl": webUrl,
                    "since": "2015-12-21T21:47:11+00:00"
                }
            }, response);
            facebookRouteHelper.pageRouter();
        });

    });

    describe("tokenRouter", () => {
        let facebookRequestHandlerInstanceMock = null, sandbox = null, request1 = null;
        beforeEach("tokenRouter", () => {
            sandbox = sinon.sandbox.create();
            facebookRequestHandler = new FacebookRequestHandler(accessToken);
            facebookRequestHandlerInstanceMock = sandbox.mock(FacebookRequestHandler).expects("instance");
            request1 = {
                "body": {
                    "accessToken": accessToken,
                    "userName": userName
                }
            };
        });

        afterEach("tokenRouter", () => {
            sandbox.restore();
        });

        it("should response with long lived token expiration time", (done) => {
            let expiresAfter = "12233";
            facebookRequestHandlerInstanceMock.withArgs(accessToken).returns(facebookRequestHandler);
            let facebookRequestHandlerStub = sinon.stub(facebookRequestHandler, "setToken");
            let response = {
                "status": (status) => {
                    assert.strictEqual(HttpResponseHandler.codes.OK, status);
                    return response;
                },
                "json": (json) => {
                    assert.deepEqual(json, { "expires_after": expiresAfter });
                    facebookRequestHandlerInstanceMock.verify();
                    done();
                }
            };

            facebookRequestHandlerStub.withArgs(userName).returns(Promise.resolve(expiresAfter));

            let facebookRouteHelper = new FacebookRouteHelper(request1, response);
            facebookRouteHelper.tokenRouter();
        });

        it("should set the error on the response in case if token can not be fetched from facebook", (done) => {

            facebookRequestHandlerInstanceMock.withArgs(accessToken).returns(facebookRequestHandler);
            let facebookRequestHandlerStub = sinon.stub(facebookRequestHandler, "setToken");
            facebookRequestHandlerStub.withArgs(userName).returns(Promise.reject("error"));

            let response = {
                "status": (status) => {
                    assert.strictEqual(status, HttpResponseHandler.codes.INTERNAL_SERVER_ERROR);
                    return response;
                },
                "json": (json) => {
                    assert.deepEqual(json, "error");
                    facebookRequestHandlerInstanceMock.verify();
                    done();
                }
            };

            let facebookRouteHelper = new FacebookRouteHelper(request1, response);
            facebookRouteHelper.tokenRouter();
        });

        it("should reject the request if access token is missing", (done) => {
            let response = {
                "status": (status) => {
                    assert.strictEqual(HttpResponseHandler.codes.BAD_REQUEST, status);
                    done();
                },
                "json": (json) => { //eslint-disable-line

                }
            };

            let facebookRouteHelper = new FacebookRouteHelper({
                "body": {

                }
            }, response);
            facebookRouteHelper.tokenRouter();
        });

        it("should reject the request if user name is missing", (done) => {
            let response = {
                "status": (status) => {
                    assert.strictEqual(HttpResponseHandler.codes.BAD_REQUEST, status);
                    done();
                },
                "json": (json) => { //eslint-disable-line

                }
            };

            let facebookRouteHelper = new FacebookRouteHelper({
                "body": {
                    "accessToken": accessToken
                }
            }, response);
            facebookRouteHelper.tokenRouter();
        });
    });

    describe("fetchMultiplePages", () => {

        let sandbox = null;

        beforeEach("fetchMultiplePages", () => {
            sandbox = sinon.sandbox.create();
        });

        afterEach("fetchMultiplePages", () => {
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
            fetchFacebookFeedRequestStub.withArgs(requestData.body.data[0].url, { "since": "2016-01-10T10:58:18.000Z" }).returns(Promise.resolve(urlResponse1));
            fetchFacebookFeedRequestStub.withArgs(requestData.body.data[1].url, { "since": "2016-01-10T10:58:18.000Z" }).returns(Promise.resolve(urlResponse2));

            let facebookRouteHelper = new FacebookRouteHelper(requestData, response);
            facebookRouteHelper.fetchMultiplePages();

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
            fetchFacebookFeedRequestStub.withArgs(requestData.body.data[0].url).returns(Promise.resolve(urlResponse1));
            fetchFacebookFeedRequestStub.withArgs(requestData.body.data[1].url).returns(Promise.reject("error"));

            let facebookRouteHelper = new FacebookRouteHelper(requestData, response);
            facebookRouteHelper.fetchMultiplePages();

        });
    });
});

