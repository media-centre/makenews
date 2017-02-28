import DelteHashtagRoute from "../../../src/routes/helpers/DeleteSourceRoute";
import DeleteHashtagHandler from "../../../src/hashtags/DeleteSourceHandler";
import sinon from "sinon";
import { assert } from "chai";

describe("DeleteSourceRoute", () => {
    it("should give success response", async () => {
        let sources = ["source1"];
        let request = {
            "cookies": {
                "AuthSession": "test_session"
            },
            "body": {
                "sources": sources
            }
        };
        let sandbox = sinon.sandbox.create();
        let deleteHandler = DeleteHashtagHandler.instance();
        sandbox.mock(DeleteHashtagHandler).expects("instance").returns(deleteHandler);
        let deleteHashtsgMock = sandbox.mock(deleteHandler).expects("deleteSources")
            .withExactArgs(sources, "test_session").returns(Promise.resolve({ "ok": true }));
        let deleteHashtagRoute = new DelteHashtagRoute(request, {});
        try {
            await deleteHashtagRoute.handle();
            deleteHashtsgMock.verify();
        } catch(error) {
            assert.fail(error);
        } finally {
            sandbox.restore();
        }
    });
});
