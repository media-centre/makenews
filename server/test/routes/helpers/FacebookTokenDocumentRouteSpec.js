import FacebookTokenDocumentRoute from "../../../src/routes/helpers/FacebookTokenDocumentRoute";
import HttpResponseHandler from "../../../../common/src/HttpResponseHandler";
import FacebookTokenDocument from "../../../src/facebook/FacebookTokenDocument";
import sinon from "sinon";
import { assert } from "chai";

describe("FacebookTokenDocumentRoute", () => {
    describe("getExpiredTime", () => {
        let facebookTokenDocument = null;
        let facebookTokenDocumentInstanceMock = null;
        let sandbox = null;
        let request1 = null;
        let next = null;
        const authSession = "authSession";
        beforeEach("getTokenExpireTime", () => {
            sandbox = sinon.sandbox.create();
            facebookTokenDocument = new FacebookTokenDocument();
            facebookTokenDocumentInstanceMock = sandbox.mock(FacebookTokenDocument).expects("instance");
            request1 = {
                "cookies": {
                    "AuthSession": authSession
                }
            };
            next = {};
        });

        afterEach("getTokenExpireTime", () => {
            sandbox.restore();
        });

        it("should respond with token expiration info", (done) => {
            const isExpired = true;
            facebookTokenDocumentInstanceMock.returns(facebookTokenDocument);
            const facebookTokenDocumentStub = sandbox.stub(facebookTokenDocument, "isExpired");
            const response = {
                "status": (status) => {
                    assert.strictEqual(HttpResponseHandler.codes.OK, status);
                    return response;
                },
                "json": (json) => {
                    assert.deepEqual(json, { isExpired });
                    facebookTokenDocumentInstanceMock.verify();
                    done();
                }
            };

            facebookTokenDocumentStub.withArgs(authSession).returns(Promise.resolve(isExpired));
            new FacebookTokenDocumentRoute(request1, response, next).isExpired();
        });
    });
});
