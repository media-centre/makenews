/* eslint no-unused-expressions:0, max-nested-callbacks: [2, 5] */

import HttpResponseHandler from "../../../../common/src/HttpResponseHandler";
import FacebookSetAccessTokenRoute from "../../../src/routes/helpers/FacebookSetAccessTokenRoute";
import FacebookRequestHandler from "../../../src/facebook/FacebookRequestHandler";
import sinon from "sinon";
import { assert } from "chai";


describe("FacebookSetAccessTokenRoute", () => {
    describe("handle", () => {
        let accessToken = null;
        let facebookRequestHandler = null;
        let facebookRequestHandlerInstanceMock = null;
        let sandbox = null;
        let request1 = null;
        let next = null;
        const authSession = "authSession";
        beforeEach("handle", () => {
            accessToken = "test_access_token";
            sandbox = sinon.sandbox.create();
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
            const expiresAfter = "12233";
            facebookRequestHandlerInstanceMock.withArgs(accessToken).returns(facebookRequestHandler);
            const facebookRequestHandlerStub = sinon.stub(facebookRequestHandler, "setToken");
            const response = {
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
            const facebookRequestHandlerStub = sinon.stub(facebookRequestHandler, "setToken");
            facebookRequestHandlerStub.withArgs(authSession).returns(Promise.reject("error"));

            const response = {
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
            const response = {
                "status": (status) => {
                    assert.strictEqual(HttpResponseHandler.codes.UNPROCESSABLE_ENTITY, status);
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
    });

});

