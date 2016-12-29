/*eslint max-nested-callbacks:0*/
import HttpResponseHandler from "../../../../common/src/HttpResponseHandler";
import TwitterTokenRoute from "../../../src/routes/helpers/TwitterTokenRoute";
import TwitterToken from "../../../src/twitter/TwitterToken";
import Logger from "../../../src/logging/Logger";
import LogTestHelper from "../../helpers/LogTestHelper";
import sinon from "sinon";

describe("TwitterTokenRoute", () => {
    describe("handle", () => {
        let sandbox = null;
        beforeEach("beforeEach", () => {
            sandbox = sinon.sandbox.create();
            sandbox.stub(Logger, "instance").returns(LogTestHelper.instance());
        });

        afterEach("afterEach", () => {
            sandbox.restore();
        });

        it("should return the twitterAuthentication as true if document is present in the database", () => {
            let twitterToken = new TwitterToken();
            sandbox.stub(TwitterToken, "instance").returns(twitterToken);
            let tokenMock = sandbox.mock(twitterToken).expects("isPresent").withArgs("test_session").returns(Promise.resolve(true));
            let response = { "status": () => {}, "json": () => {} };
            let request = {
                "cookies": { "AuthSession": "test_session" }
            };
            let responseMock = sandbox.mock(response);
            responseMock.expects("status").withArgs(HttpResponseHandler.codes.OK);
            responseMock.expects("json").withArgs({ "twitterAuthenticated": true });
            let twitterTokenRoute = new TwitterTokenRoute(request, response);
            return Promise.resolve(twitterTokenRoute.handle()).then(() => {
                tokenMock.verify();
                responseMock.verify();
            });
        });
    });
});
