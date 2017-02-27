import DelteHashtagRoute from "../../../src/routes/helpers/DeleteHashtagRoute";
import DeleteHashtagHandler from "../../../src/hashtags/DeleteHashtagsHandler";
import sinon from "sinon";
import { assert } from "chai";

describe("DeleteHashtagRoute", () => {
    it("should give success response", async () => {
        let request = {
            "cookies": {
                "AuthSession": "test_session"
            }
        };
        let sandbox = sinon.sandbox.create();
        let deleteHandler = DeleteHashtagHandler.instance();
        sandbox.mock(DeleteHashtagHandler).expects("instance").returns(deleteHandler);
        let deleteHashtsgMock = sandbox.mock(deleteHandler).expects("deleteHashtags")
            .withExactArgs("test_session").returns(Promise.resolve({ "ok": true }));
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
