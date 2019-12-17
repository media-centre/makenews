import DelteHashtagRoute from "../../../src/routes/helpers/DeleteSourceRoute";
import DeleteHashtagHandler from "../../../src/hashtags/DeleteSourceHandler";
import sinon from "sinon";
import { assert } from "chai";

describe("DeleteSourceRoute", () => {
    it("should give success response", async() => {
        const sources = ["source1"];
        const request = {
            "cookies": {
                "AuthSession": "test_session"
            },
            "body": {
                "sources": sources
            }
        };
        const sandbox = sinon.sandbox.create();
        const deleteHandler = DeleteHashtagHandler.instance("test_session");
        sandbox.mock(DeleteHashtagHandler).expects("instance").returns(deleteHandler);
        const deleteHashtsgMock = sandbox.mock(deleteHandler).expects("deleteSources")
            .withExactArgs(sources).returns(Promise.resolve({ "ok": true }));
        const deleteHashtagRoute = new DelteHashtagRoute(request, {});
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
