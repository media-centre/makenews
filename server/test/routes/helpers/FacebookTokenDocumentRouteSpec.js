import FacebookTokenDocumentRoute from "../../../src/routes/helpers/FacebookTokenDocumentRoute";
import HttpResponseHandler from "../../../../common/src/HttpResponseHandler";
import FacebookTokenDocument from "../../../src/facebook/FacebookTokenDocument";
import Logger from "../../../src/logging/Logger";
import LogTestHelper from "../../helpers/LogTestHelper";
import sinon from "sinon";
import { assert } from "chai";

describe("FacebookTokenDocument", () => {
    describe("getExpiredTime", () => {
        let facebookTokenDocument = null, facebookTokenDocumentInstanceMock = null, sandbox = null, request1 = null, next = null;
        let authSession = "authSession";
        beforeEach("getExpiresTime", () => {
            sandbox = sinon.sandbox.create();
            sandbox.stub(Logger, "instance").returns(LogTestHelper.instance());
            facebookTokenDocument = new FacebookTokenDocument();
            facebookTokenDocumentInstanceMock = sandbox.mock(FacebookTokenDocument).expects("instance");
            request1 = {
                "cookies": {
                    "AuthSession": authSession
                }
            };
            next = {};
        });

        afterEach("getExpiresTime", () => {
            sandbox.restore();
        });

        it("should response with token expiration time", (done) => {
            let expiresAfter = "12233";
            facebookTokenDocumentInstanceMock.returns(facebookTokenDocument);
            let facebookTokenDocumentStub = sandbox.stub(facebookTokenDocument, "getExpiredTime");
            let response = {
                "status": (status) => {
                    assert.strictEqual(HttpResponseHandler.codes.OK, status);
                    return response;
                },
                "json": (json) => {
                    assert.deepEqual(json, { "expireTime": expiresAfter });
                    facebookTokenDocumentInstanceMock.verify();
                    done();
                }
            };

            facebookTokenDocumentStub.withArgs(authSession).returns(Promise.resolve(expiresAfter));

            new FacebookTokenDocumentRoute(request1, response, next).getExpiredTime();
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

            let facebookAccessTokenRoute = new FacebookTokenDocumentRoute({ "cookies": {} }, response, next);
            facebookAccessTokenRoute.getExpiredTime();
        });
    });
});
