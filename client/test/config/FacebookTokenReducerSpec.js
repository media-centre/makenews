import { tokenExpiresTime } from "../../src/js/config/reducers/FacebookTokenReducer";
import { FACEBOOK_EXPIRE_TIME } from "../../src/js/facebook/FacebookAction";
import { assert } from "chai";

describe("FacebookExpireTime", () => {
    it("should return the access token Expires time", () => {
        let expiresAfter = 1234;
        let action = {
            "type": FACEBOOK_EXPIRE_TIME,
            "expireTime": expiresAfter
        };
        let response = tokenExpiresTime({}, action);
        assert.strictEqual(response.expireTime, expiresAfter);
    });

    it("should return the default state when there is no action type", () => {
        let response = tokenExpiresTime({}, {});
        assert.deepEqual(response, {});
    });
});
