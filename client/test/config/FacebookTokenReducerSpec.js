import { tokenExpiresTime } from "../../src/js/config/reducers/FacebookTokenReducer";
import { FACEBOOK_EXPIRE_TIME } from "../../src/js/facebook/FacebookAction";
import { assert } from "chai";

describe("FacebookExpireTime", () => {
    it("Should return the access token Expires time", () => {
        let expiresAfter = 1234;
        let action = {
            "type": FACEBOOK_EXPIRE_TIME,
            "expires_after": expiresAfter
        };
        let response = tokenExpiresTime({}, action);
        assert.strictEqual(response.expiresTime, expiresAfter);
    });

    it("Should return the default state when there is no action type", () => {
        let response = tokenExpiresTime({}, {});
        assert.deepEqual(response, {});
    });
});
