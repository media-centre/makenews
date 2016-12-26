/* eslint no-unused-expressions:0, max-nested-callbacks: [2, 5] */

import HttpResponseHandler from "../../../../common/src/HttpResponseHandler";
import FacebookSetAccessTokenRoute from "../../../src/routes/helpers/FacebookSetAccessTokenRoute";
import FacebookRequestHandler from "../../../src/facebook/FacebookRequestHandler";
import Logger from "../../../src/logging/Logger";
import LogTestHelper from "../../helpers/LogTestHelper";
import sinon from "sinon";
import { assert } from "chai";


describe("FacebookSetAccessTokenRoute", () => {
    describe("handle", () => {
        let accessToken = null, facebookRequestHandler = null, facebookRequestHandlerInstanceMock = null, sandbox = null, request1 = null, next = null, userName = "test1";
        let authSession = "authSession";
        beforeEach("handle", () => {
            accessToken = "test_access_token";
            sandbox = sinon.sandbox.create();
            sandbox.stub(Logger, "instance").returns(LogTestHelper.instance());
            facebookRequestHandler = new FacebookRequestHandler(accessToken);
            facebookRequestHandlerInstanceMock = sandbox.mock(FacebookRequestHandler).expects("instance");
            request1 = {
                "body": {
                    "accessToken": accessToken
                },
                "cookies": {
                    "AuthSession": authSession
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

            facebookRequestHandlerStub.withArgs(authSession).returns(Promise.resolve(expiresAfter));

            new FacebookSetAccessTokenRoute(request1, response, next).handle();
        });

        it("should set the error on the response in case if token can not be fetched from facebook", (done) => {

            facebookRequestHandlerInstanceMock.withArgs(accessToken).returns(facebookRequestHandler);
            let facebookRequestHandlerStub = sinon.stub(facebookRequestHandler, "setToken");
            facebookRequestHandlerStub.withArgs(authSession).returns(Promise.reject("error"));

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

                },
                "cookies": {
                    "AuthSession": null
                }
            }, response, next).handle();
        });

        it("should reject the request if authSession is missing", (done) => {
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
                },
                "cookies": {

                }
            }, response, next);
            facebookAccessTokenRoute.handle();
        });
    });

});

