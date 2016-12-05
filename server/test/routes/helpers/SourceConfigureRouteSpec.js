import HttpResponseHandler from "../../../../common/src/HttpResponseHandler";
import SourceConfigureRoute from "../../../src/routes/helpers/SourceConfigureRoute";
import { assert } from "chai";
import sinon from "sinon";
import Logger from "../../../src/logging/Logger";
import LogTestHelper from "../../helpers/LogTestHelper";
import SourceConfigRequestHandler from "../../../src/sourceConfig/SourceConfigRequestHandler";

describe("SourceConfigureRoute", () => {

    let sandbox = sinon.sandbox.create();

    beforeEach("SourceConfigureRoute", () => {
        sandbox.stub(Logger, "instance").returns(LogTestHelper.instance());
    });

    afterEach("SourceConfigureRoute", () => {
        sandbox.restore();
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

        let sourceRoute = new SourceConfigureRoute({
            "cookies": {}
        }, response);
        sourceRoute.fetchConfiguredSources();
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

        let sourceRoute = new SourceConfigureRoute({
            "cookies": { "AuthSession": "session" }
        }, response);

        let sourceRequestHandler = new SourceConfigRequestHandler();
        sandbox.mock(SourceConfigRequestHandler).expects("instance").returns(sourceRequestHandler);

        let configStub = sandbox.stub(sourceRequestHandler, "fetchConfiguredSources");
        configStub.withArgs("session").returns(Promise.reject("error fetching data"));

        sourceRoute.fetchConfiguredSources();
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

        let sourceRoute = new SourceConfigureRoute({
            "cookies": { "AuthSession": "session" }
        }, response);

        let sourceRequestHandler = new SourceConfigRequestHandler();
        sandbox.mock(SourceConfigRequestHandler).expects("instance").returns(sourceRequestHandler);

        let configStub = sandbox.stub(sourceRequestHandler, "fetchConfiguredSources");
        configStub.withArgs("session").returns(Promise.resolve(sources));

        sourceRoute.fetchConfiguredSources();
    });
});
