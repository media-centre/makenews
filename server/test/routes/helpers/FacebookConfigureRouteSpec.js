import HttpResponseHandler from "../../../../common/src/HttpResponseHandler";
import FacebookConfigureRoute from "../../../src/routes/helpers/FacebookConfigureRoute";
import { assert } from "chai";
import sinon from "sinon";
import Logger from "../../../src/logging/Logger";
import LogTestHelper from "../../helpers/LogTestHelper";
import FacebookRequestHandler from "../../../src/facebook/FacebookRequestHandler";

describe("FacebookProfilesRoutes", () => {

    let sandbox = sinon.sandbox.create();

    beforeEach("FacebookProfilesRoutes", () => {
        sandbox.stub(Logger, "instance").returns(LogTestHelper.instance());
    });

    afterEach("FacebookProfilesRoute", () => {
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
        facebookRoute.fetchProfiles();
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
        facebookRoute.fetchProfiles();
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
        
        let configStub = sandbox.stub(facebookRequestHandler, "fetchConfiguredSourcesOf");
        configStub.withArgs("profiles", "user", "session").returns(Promise.reject("error fetching data"));

        facebookRoute.fetchProfiles();
    });

    it("should get the sources", (done) => {
        let profiles = [{ "name": "profile1" }, { "name": "profile2" }];
        let response = {
            "status": (status) => {
                assert.strictEqual(HttpResponseHandler.codes.OK, status);
                return response;
            },
            "json": (json) => {
                try {
                    assert.deepEqual({ "profiles": profiles }, json);
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

        let configStub = sandbox.stub(facebookRequestHandler, "fetchConfiguredSourcesOf");
        configStub.withArgs("profiles", "user", "session").returns(Promise.resolve(profiles));

        facebookRoute.fetchProfiles();
    });
});
