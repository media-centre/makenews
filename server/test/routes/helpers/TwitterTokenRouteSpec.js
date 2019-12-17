/*eslint max-nested-callbacks:0*/
import HttpResponseHandler from "../../../../common/src/HttpResponseHandler";
import TwitterTokenRoute from "../../../src/routes/helpers/TwitterTokenRoute";
import TwitterToken from "../../../src/twitter/TwitterToken";
import sinon from "sinon";

describe("TwitterTokenRoute", () => {
    describe("handle", () => {
        let sandbox = null;
        beforeEach("beforeEach", () => {
            sandbox = sinon.sandbox.create();
        });

        afterEach("afterEach", () => {
            sandbox.restore();
        });

        it("should return the twitterAuthentication as true if document is present in the database", () => {
            const twitterToken = new TwitterToken();
            sandbox.stub(TwitterToken, "instance").returns(twitterToken);
            const tokenMock = sandbox.mock(twitterToken).expects("isPresent").withArgs("test_session").returns(Promise.resolve(true));
            const response = { "status": () => {}, "json": () => {} };
            const request = {
                "cookies": { "AuthSession": "test_session" }
            };
            const responseMock = sandbox.mock(response);
            responseMock.expects("status").withArgs(HttpResponseHandler.codes.OK);
            responseMock.expects("json").withArgs({ "twitterAuthenticated": true });
            const twitterTokenRoute = new TwitterTokenRoute(request, response);
            return Promise.resolve(twitterTokenRoute.handle()).then(() => {
                tokenMock.verify();
                responseMock.verify();
            });
        });
    });
});
