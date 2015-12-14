/* eslint no-unused-expressions:0, max-nested-callbacks: [2, 5] */
"use strict";
import HttpResponseHandler from "../../../../common/src/HttpResponseHandler.js";
import FacebookRouteHelper from "../../../src/routes/helpers/FacebookRouteHelper.js";
import FacebookRequestHandler from "../../../src/facebook/FacebookRequestHandler.js";
import sinon from "sinon";
import { assert } from "chai";


describe("FacebookRouteHelper", () => {
    let request = null, facebookRequestHandler = null, accessToken = null, pageName = null;
    before("FacebookRouteHelper", () => {
        accessToken = "test_access_token";
        pageName = "test_page";
        request = {
            "query": {
                "nodeName": pageName,
                "accessToken": accessToken
            }
        };

    });

    describe("pageRouter", () => {
        beforeEach("pageRouter", () => {
            facebookRequestHandler = new FacebookRequestHandler(accessToken);
        });
        it("should set the the facebook feeds on response", (done) => {

            let facebookRequestHandlerMock = sinon.mock(FacebookRequestHandler).expects("instance");
            facebookRequestHandlerMock.withArgs(accessToken).returns(facebookRequestHandler);
            let facebookRequestHandlerStub = sinon.stub(facebookRequestHandler, "pagePosts");
            let posts = [
                {
                    "message": "Lammasingi village in #AndhraPradesh is a meteorological oddity. \n\nFind out how - bit.ly/1Y19P17",
                    "created_time": "2015-12-11T08:02:59+0000",
                    "id": "163974433696568_958425464251457"
                }];
            let response = {
                "status": (status) => {
                    assert.strictEqual(HttpResponseHandler.codes.OK, status);
                    return response;
                },
                "json": (json) => {
                    assert.deepEqual({ "posts": posts }, json);
                    done();
                }
            };

            facebookRequestHandlerStub.withArgs(pageName).returns(Promise.resolve(posts));

            let facebookRouteHelper = new FacebookRouteHelper(request, response);
            facebookRouteHelper.pageRouter();
            FacebookRequestHandler.instance.restore();
        });

        it("should set the error on the response in case if feeds can not be fetched from facebook", (done) => {

            let facebookRequestHandlerMock = sinon.mock(FacebookRequestHandler).expects("instance");
            facebookRequestHandlerMock.withArgs(accessToken).returns(facebookRequestHandler);
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
                    assert.strictEqual(HttpResponseHandler.codes.NOT_FOUND, status);
                    return response;
                },
                "json": (json) => {
                    assert.deepEqual(error, json);
                    done();
                }
            };

            facebookRequestHandlerStub.withArgs(pageName).returns(Promise.reject(error));

            let facebookRouteHelper = new FacebookRouteHelper(request, response);
            facebookRouteHelper.pageRouter();
            FacebookRequestHandler.instance.restore();
        });

    });
});
