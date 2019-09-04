import DeleteStoryRoute from "../../../src/routes/helpers/DeleteStoryRoute";
import LogTestHelper from "../../helpers/LogTestHelper";
import RouteLogger from "../../../src/routes/RouteLogger";
import CouchClient from "../../../src/CouchClient";
import sinon from "sinon";
import { assert } from "chai";

describe("DeleteStoryRoute", () => {
    let sandbox = sinon.sandbox.create();

    beforeEach("DeleteStoryRoute", () => {
        sandbox.stub(RouteLogger, "instance").returns(LogTestHelper.instance());
    });

    afterEach("DeleteStoryRoute", () => {
        sandbox.restore();
    });

    it("should validate id", async() => {
        let result = await new DeleteStoryRoute({
            "body": {
                "id": "id_1"
            },
            "cookies": {
                "AuthSession": "test_session"
            }
        }, {}).validate();

        assert.equal(result, "");
    });

    it("should validate id and give a message if id is not there", async() => {
        let result = await new DeleteStoryRoute({
            "body": { },
            "cookies": {
                "AuthSession": "test_session"
            }
        }, {}).validate();

        assert.equal(result, "missing parameters");
    });

    it("should call deleteStory", async() => {
        const id = "id_1", authSession = "test_session";
        const couchClientInstance = new CouchClient(authSession, "db name");
        const saveDocumentMock = sandbox.mock(couchClientInstance)
            .expects("deleteDocument")
            .withExactArgs(id)
            .returns(Promise.resolve({ "ok": true }));
        sandbox.stub(CouchClient, "instance").withArgs(authSession).returns(couchClientInstance);

        let result = await new DeleteStoryRoute({
            "body": {
                id
            },
            "cookies": {
                "AuthSession": authSession
            }
        }, {}).handle();
        saveDocumentMock.verify();
        assert.deepEqual(result, { "message": "deleted" });
    });
});
