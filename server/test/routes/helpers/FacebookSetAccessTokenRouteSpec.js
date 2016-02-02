/* eslint no-unused-expressions:0, max-nested-callbacks: [2, 5] */
"use strict";
import HttpResponseHandler from "../../../../common/src/HttpResponseHandler.js";
import FacebookSetAccessTokenRoute from "../../../src/routes/helpers/FacebookSetAccessTokenRoute.js";
import FacebookRequestHandler from "../../../src/facebook/FacebookRequestHandler.js";
import sinon from "sinon";
import { assert } from "chai";


describe("FacebookSetAccessTokenRoute", () => {
    describe("handle", () => {
        let accessToken = null, facebookRequestHandler = null, facebookRequestHandlerInstanceMock = null, sandbox = null, request1 = null, next = null, userName = "test1";
        beforeEach("handle", () => {
            accessToken = "test_access_token";
            sandbox = sinon.sandbox.create();
            facebookRequestHandler = new FacebookRequestHandler(accessToken);
            facebookRequestHandlerInstanceMock = sandbox.mock(FacebookRequestHandler).expects("instance");
            request1 = {
                "body": {
                    "accessToken": accessToken,
                    "userName": userName
                }
            };
            next = {};
        });

        afterEach("handle", () => {
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

            new FacebookSetAccessTokenRoute(request1, response, next).handle();
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

            new FacebookSetAccessTokenRoute(request1, response, next).handle();
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

            new FacebookSetAccessTokenRoute({
                "body": {

                }
            }, response, next).handle();
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

            let facebookAccessTokenRoute = new FacebookSetAccessTokenRoute({
                "body": {
                    "accessToken": accessToken
                }
            }, response, next);
            facebookAccessTokenRoute.handle();
        });
    });

});

