import HttpResponseHandler from "../../../../common/src/HttpResponseHandler";
import FacebookAddConfigureRoute from "../../../src/routes/helpers/FacebookAddConfigureRoute";
import { assert } from "chai";
import sinon from "sinon";
import Logger from "../../../src/logging/Logger";
import LogTestHelper from "../../helpers/LogTestHelper";
import FacebookRequestHandler from "../../../src/facebook/FacebookRequestHandler";
import { sourceTypes } from "../../../src/util/Constants";
import mockResponse from "../../helpers/MockResponse";

describe("FacebookAddConfigureRoute", () => {

    let sandbox = sinon.sandbox.create();
    let sourceType = "fb-profile";

    beforeEach("FacebookAddConfigureRoute", () => {
        sandbox.stub(Logger, "instance").returns(LogTestHelper.instance());
    });

    afterEach("FacebookAddConfigureRoute", () => {
        sandbox.restore();
    });

    it("should reject the request if type is missing", (done) => {
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

        let facebookRoute = new FacebookAddConfigureRoute({
            "cookies": { "AuthSession": "session" },
            "body": {
                "source": {},
                "dbName": "",
                "type": sourceTypes.fb_page
            }
        }, response);
        facebookRoute.addConfiguredSource(sourceType);
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

        let facebookRoute = new FacebookAddConfigureRoute({
            "query": { "dbName": "user" },
            "body": { "source": {} },
            "cookies": {}
        }, response);
        facebookRoute.addConfiguredSource(sourceType);
    });

    it("should reject the request if source name or url is missing", (done) => {
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

        let facebookRoute = new FacebookAddConfigureRoute({
            "query": { "dbName": "user" },
            "body": { "source": {} },
            "cookies": { "AuthSession": "session" }
        }, response);
        facebookRoute.addConfiguredSource(sourceType);
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
        let source = { "name": "SourceName", "url": "http://source.url/" };

        let facebookRoute = new FacebookAddConfigureRoute({
            "query": { "dbName": "user" },
            "cookies": { "AuthSession": "session" },
            "body": { "source": source }
        }, response);

        let facebookRequestHandler = new FacebookRequestHandler("token");
        sandbox.mock(FacebookRequestHandler).expects("instance").withArgs("token").returns(facebookRequestHandler);

        let configStub = sandbox.stub(facebookRequestHandler, "addConfiguredSource");
        configStub.withArgs(source, "user", "session").returns(Promise.reject("error fetching data"));

        facebookRoute.addConfiguredSource(sourceType);
    });

    it("should add the source to configured list", async () => {
        let data = { "ok": true, "id": "SourceName", "rev": "1-5df5bc8192a245443f7d71842804c5c7" };
        let source = [{ "name": "SourceName", "url": "http://source.url/" }];
        let response = mockResponse();

        let facebookRoute = new FacebookAddConfigureRoute({
            "cookies": { "AuthSession": "session" },
            "body": { "sources": source, "type": sourceTypes.fb_group }
        }, response);

        let facebookRequestHandler = new FacebookRequestHandler("token");
        sandbox.mock(FacebookRequestHandler).expects("instance").withArgs("token").returns(facebookRequestHandler);

        let configStub = sandbox.stub(facebookRequestHandler, "addConfiguredSource");
        configStub.withArgs(sourceTypes[sourceTypes.fb_group], source, "session").returns(Promise.resolve(data));

        await facebookRoute.addConfiguredSource();
        assert.strictEqual(response.status(), HttpResponseHandler.codes.OK);
        assert.deepEqual(response.json(), data);
    });
});
