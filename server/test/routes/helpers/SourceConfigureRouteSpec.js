import HttpResponseHandler from "../../../../common/src/HttpResponseHandler";
import SourceConfigureRoute from "../../../src/routes/helpers/SourceConfigureRoute";
import { assert } from "chai";
import { sourceTypes } from "../../../src/util/Constants";
import sinon from "sinon";
import Logger from "../../../src/logging/Logger";
import LogTestHelper from "../../helpers/LogTestHelper";
import SourceConfigRequestHandler from "../../../src/sourceConfig/SourceConfigRequestHandler";
import mockResponse from "../../helpers/MockResponse";

describe("SourceConfigureRoute", () => {

    describe("fetch Configured Sources", () => {
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
                    } catch (error) {
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
                    } catch (error) {
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

    describe("add configure source", () => {
        let sandbox = sinon.sandbox.create();
        let sourceType = "fb-profile";

        beforeEach("add configure source", () => {
            sandbox.stub(Logger, "instance").returns(LogTestHelper.instance());
        });

        afterEach("add configure source", () => {
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

            let configRoute = new SourceConfigureRoute({
                "cookies": { "AuthSession": "session" },
                "body": {
                    "source": {},
                    "dbName": "",
                    "type": sourceTypes.fb_page
                }
            }, response);
            configRoute.addConfiguredSource(sourceType);
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

            let configRoute = new SourceConfigureRoute({
                "query": { "dbName": "user" },
                "body": { "source": {} },
                "cookies": {}
            }, response);
            configRoute.addConfiguredSource(sourceType);
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

            let configRoute = new SourceConfigureRoute({
                "query": { "dbName": "user" },
                "body": { "source": {} },
                "cookies": { "AuthSession": "session" }
            }, response);
            configRoute.addConfiguredSource(sourceType);
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

            let configRoute = new SourceConfigureRoute({
                "query": { "dbName": "user" },
                "cookies": { "AuthSession": "session" },
                "body": { "source": source }
            }, response);

            let configRequestHandler = new SourceConfigRequestHandler();
            sandbox.mock(SourceConfigRequestHandler).expects("instance").returns(configRequestHandler);

            let configStub = sandbox.stub(configRequestHandler, "addConfiguredSource");
            configStub.withArgs(source, "user", "session").returns(Promise.reject("error fetching data"));

            configRoute.addConfiguredSource(sourceType);
        });

        it("should add the source to configured list", async () => {
            let data = { "ok": true, "id": "SourceName", "rev": "1-5df5bc8192a245443f7d71842804c5c7" };
            let source = [{ "name": "SourceName", "url": "http://source.url/" }];
            let response = mockResponse();

            let facebookRoute = new SourceConfigureRoute({
                "cookies": { "AuthSession": "session" },
                "body": { "sources": source, "type": sourceTypes.fb_group }
            }, response);

            let configRequestHandler = new SourceConfigRequestHandler("token");
            sandbox.mock(SourceConfigRequestHandler).expects("instance").returns(configRequestHandler);

            let configStub = sandbox.stub(configRequestHandler, "addConfiguredSource");
            configStub.withArgs(sourceTypes[sourceTypes.fb_group], source, "session").returns(Promise.resolve(data));

            await facebookRoute.addConfiguredSource();
            assert.strictEqual(response.status(), HttpResponseHandler.codes.OK);
            assert.deepEqual(response.json(), data);
        });
    });
});
