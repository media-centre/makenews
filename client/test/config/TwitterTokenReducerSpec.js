import { twitterTokenInfo } from "../../src/js/config/reducers/TwitterTokenReducer";
import { TWITTER_AUTHENTICATION } from "../../src/js/twitter/TwitterTokenActions";
import { assert } from "chai";

describe("Twitter Token Info", () => {
    it("should return the access token ", () => {
        let twitterAuthenticated = true;
        let action = {
            "type": TWITTER_AUTHENTICATION,
            "twitterAuthenticated": twitterAuthenticated
        };
        let response = twitterTokenInfo({}, action);
        assert.strictEqual(response.twitterAuthenticated, twitterAuthenticated);
    });

    it("should return the default state when there is no action type", () => {
        let response = twitterTokenInfo({}, {});
        assert.deepEqual(response, {});
    });
});
