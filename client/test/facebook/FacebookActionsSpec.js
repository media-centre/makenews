import { updateTokenExpireTime, FACEBOOK_EXPIRE_TIME } from "../../src/js/facebook/FaceBookAction";
import { assert } from "chai";
describe("FacebookActions", () => {
    it("it should return the action type and expires_after value", () => {
        let expiresAfter = 1234;
        let action = {
            "type": FACEBOOK_EXPIRE_TIME,
            "expires_after": expiresAfter
        };
        let result = updateTokenExpireTime(expiresAfter);
        assert.strictEqual(result.type, action.type);
        assert.strictEqual(result.expires_after, action.expires_after);
    });
});
