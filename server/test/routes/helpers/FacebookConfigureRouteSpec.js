import HttpResponseHandler from "../../../../common/src/HttpResponseHandler";
import FacebookConfigureRoute from "../../../src/routes/helpers/FacebookConfigureRoute";
import { assert } from "chai";
import sinon from "sinon";
import Logger from "../../../src/logging/Logger";
import LogTestHelper from "../../helpers/LogTestHelper";
import FacebookRequestHandler from "../../../src/facebook/FacebookRequestHandler";

describe("FacebookConfigureRoute", () => {

    let sandbox = sinon.sandbox.create();

    beforeEach("FacebookConfigureRoute", () => {
        sandbox.stub(Logger, "instance").returns(LogTestHelper.instance());
    });

    afterEach("FacebookConfigureRoute", () => {
        sandbox.restore();
    });

    it("should reject the request if db name is missing", (done) => {
        let response = {
            "status": (status) => {
                try {
                    assert.strictEqual(HttpResponseHandler.codes.BAD_REQUEST, status);
                    done();
                } catch(error) {
                    done(error);
                }
            }
        };

        let facebookRoute = new FacebookConfigureRoute({
            "query": {},
            "cookies": { "AuthSession": "session" }
        }, response);
        facebookRoute.fetchConfiguredSources();
    });

    it("should reject the request if auth session is missing", (done) => {
        let response = {
            "status": (status) => {
                try {
                    assert.strictEqual(HttpResponseHandler.codes.BAD_REQUEST, status);
                    done();
                } catch(error) {
                    done(error);
                }
            }
        };

        let facebookRoute = new FacebookConfigureRoute({
            "query": { "dbName": "user" },
            "cookies": {}
        }, response);
        facebookRoute.fetchConfiguredSources();
    });

    it("should give 400 when there is a problem getting the sources", (done) => {
        let response = {
            "status": (status) => {
                try {
                    assert.strictEqual(HttpResponseHandler.codes.BAD_REQUEST, status);
                    done();
                } catch(error) {
                    done(error);
                }
            }
        };

        let facebookRoute = new FacebookConfigureRoute({
            "query": { "dbName": "user" },
            "cookies": { "AuthSession": "session" }
        }, response);

        let facebookRequestHandler = new FacebookRequestHandler("token");
        sandbox.mock(FacebookRequestHandler).expects("instance").withArgs("token").returns(facebookRequestHandler);
        
        let configStub = sandbox.stub(facebookRequestHandler, "fetchConfiguredSources");
        configStub.withArgs("user", "session").returns(Promise.reject("error fetching data"));

        facebookRoute.fetchConfiguredSources();
    });

    it("should get the sources", (done) => {
        let sources = {
            "profiles": [{ "name": "Name", "id": "Id_" }],
            "pages": [], "groups": [], "twitter": [], "web": []
        };
        let response = {
            "status": (status) => {
                assert.strictEqual(HttpResponseHandler.codes.OK, status);
                return response;
            },
            "json": (json) => {
                try {
                    assert.deepEqual(sources, json);
                    done();
                } catch (err) {
                    done(err);
                }
            }
        };

        let facebookRoute = new FacebookConfigureRoute({
            "query": { "dbName": "user" },
            "cookies": { "AuthSession": "session" }
        }, response);

        let facebookRequestHandler = new FacebookRequestHandler("token");
        sandbox.mock(FacebookRequestHandler).expects("instance").withArgs("token").returns(facebookRequestHandler);

        let configStub = sandbox.stub(facebookRequestHandler, "fetchConfiguredSources");
        configStub.withArgs("user", "session").returns(Promise.resolve(sources));

        facebookRoute.fetchConfiguredSources();
    });
});
