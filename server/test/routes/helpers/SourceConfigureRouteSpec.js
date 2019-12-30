import HttpResponseHandler from "../../../../common/src/HttpResponseHandler";
import SourceConfigureRoute from "../../../src/routes/helpers/SourceConfigureRoute";
import { assert } from "chai";
import { sourceTypes } from "../../../src/util/Constants";
import sinon from "sinon";
import SourceConfigRequestHandler from "../../../src/sourceConfig/SourceConfigRequestHandler";
import { mockResponse } from "../../helpers/MockResponse";

describe("SourceConfigureRoute", () => {

    describe("fetch Configured Sources", () => {
        const sandbox = sinon.sandbox.create();

        afterEach("SourceConfigureRoute", () => {
            sandbox.restore();
        });

        it("should reject the request if auth session is missing", (done) => {
            const response = {
                "status": (status) => {
                    try {
                        assert.strictEqual(HttpResponseHandler.codes.UNPROCESSABLE_ENTITY, status);
                        done();
                    } catch (error) {
                        done(error);
                    }
                }
            };

            const sourceRoute = new SourceConfigureRoute({
                "cookies": {}
            }, response);
            sourceRoute.fetchConfiguredSources();
        });

        it("should give 400 when there is a problem getting the sources", (done) => {
            const response = {
                "status": (status) => {
                    try {
                        assert.strictEqual(HttpResponseHandler.codes.BAD_REQUEST, status);
                        done();
                    } catch (error) {
                        done(error);
                    }
                },
                "json": () => {}
            };

            const sourceRoute = new SourceConfigureRoute({
                "cookies": { "AuthSession": "session" }
            }, response);

            const sourceRequestHandler = new SourceConfigRequestHandler();
            sandbox.mock(SourceConfigRequestHandler).expects("instance").returns(sourceRequestHandler);

            const configStub = sandbox.stub(sourceRequestHandler, "fetchConfiguredSources");
            configStub.withArgs("session").returns(Promise.reject("error fetching data"));

            sourceRoute.fetchConfiguredSources();
        });

        it("should get the sources", (done) => {
            const sources = {
                "profiles": [{ "name": "Name", "id": "Id_" }],
                "pages": [], "groups": [], "twitter": [], "web": []
            };
            const response = {
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

            const sourceRoute = new SourceConfigureRoute({
                "cookies": { "AuthSession": "session" }
            }, response);

            const sourceRequestHandler = new SourceConfigRequestHandler();
            sandbox.mock(SourceConfigRequestHandler).expects("instance").returns(sourceRequestHandler);

            const configStub = sandbox.stub(sourceRequestHandler, "fetchConfiguredSources");
            configStub.withArgs("session").returns(Promise.resolve(sources));

            sourceRoute.fetchConfiguredSources();
        });
    });

    describe("add configure source", () => {
        const sandbox = sinon.sandbox.create();
        const sourceType = "fb-profile";

        afterEach("add configure source", () => {
            sandbox.restore();
        });

        it("should reject the request if type is missing", (done) => {
            const response = {
                "status": (status) => {
                    try {
                        assert.strictEqual(HttpResponseHandler.codes.BAD_REQUEST, status);
                        done();
                    } catch(error) {
                        done(error);
                    }
                },
                "json": () => {}
            };

            const configRoute = new SourceConfigureRoute({
                "cookies": { "AuthSession": "session" },
                "body": {
                    "sources": [],
                    "dbName": "",
                    "type": sourceTypes.fb_page
                }
            }, response);
            configRoute.addConfiguredSource(sourceType);
        });

        it("should reject the request if auth session is missing", (done) => {
            const response = {
                "status": (status) => {
                    try {
                        assert.strictEqual(HttpResponseHandler.codes.UNPROCESSABLE_ENTITY, status);
                        done();
                    } catch(error) {
                        done(error);
                    }
                },
                "json": () => {}
            };

            const configRoute = new SourceConfigureRoute({
                "query": { "dbName": "user" },
                "body": { "sources": [] },
                "cookies": {}
            }, response);
            configRoute.addConfiguredSource(sourceType);
        });

        it("should reject the request if source name or url is missing", (done) => {
            const response = {
                "status": (status) => {
                    try {
                        assert.strictEqual(HttpResponseHandler.codes.UNPROCESSABLE_ENTITY, status);
                        done();
                    } catch(error) {
                        done(error);
                    }
                },
                "json": () => {}
            };

            const configRoute = new SourceConfigureRoute({
                "query": { "dbName": "user" },
                "body": { "sources": [] },
                "cookies": { "AuthSession": "session" }
            }, response);
            configRoute.addConfiguredSource(sourceType);
        });

        it("should give 400 when there is a problem getting the sources", (done) => {
            const response = {
                "status": (status) => {
                    try {
                        assert.strictEqual(status, HttpResponseHandler.codes.BAD_REQUEST);
                        done();
                    } catch(error) {
                        done(error);
                    }
                },
                "json": () => {}
            };
            const sources = [{ "name": "SourceName", "url": "http://source.url/" }];

            const configRoute = new SourceConfigureRoute({
                "query": { "dbName": "user" },
                "cookies": { "AuthSession": "session" },
                "body": { "sources": sources, "type": sourceTypes.fb_group }
            }, response);

            const configRequestHandler = new SourceConfigRequestHandler();
            sandbox.mock(SourceConfigRequestHandler).expects("instance").returns(configRequestHandler);

            const configStub = sandbox.mock(configRequestHandler).expects("addConfiguredSource").once();
            configStub.withArgs(sourceTypes[sourceTypes.fb_group], sources, "session").returns(Promise.reject("error fetching data"));

            configRoute.addConfiguredSource(sourceType);
        });

        it("should add the source to configured list", async() => {
            const data = { "ok": true, "id": "SourceName", "rev": "1-5df5bc8192a245443f7d71842804c5c7" };
            const sources = [{ "name": "SourceName", "url": "http://source.url/" }];
            const response = mockResponse();

            const facebookRoute = new SourceConfigureRoute({
                "cookies": { "AuthSession": "session" },
                "body": { "sources": sources, "type": sourceTypes.fb_group }
            }, response);

            const configRequestHandler = new SourceConfigRequestHandler("token");
            sandbox.mock(SourceConfigRequestHandler).expects("instance").returns(configRequestHandler);

            const configStub = sandbox.stub(configRequestHandler, "addConfiguredSource");
            configStub.withArgs(sourceTypes[sourceTypes.fb_group], sources, "session").returns(Promise.resolve(data));

            await facebookRoute.addConfiguredSource();
            assert.strictEqual(response.status(), HttpResponseHandler.codes.OK);
            assert.deepEqual(response.json(), data);
        });
    });
});
