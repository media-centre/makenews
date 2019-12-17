import { sourcesAuthenticationInfo } from "../../src/js/config/reducers/SourcesAuthenticationInfo";
import { FACEBOOK_EXPIRE_INFO } from "../../src/js/facebook/FacebookAction";
import { TWITTER_AUTHENTICATION } from "./../../src/js/twitter/TwitterTokenActions";
import { assert } from "chai";
import sinon from "sinon";

describe("SourcesAuthenticationInfo", () => {
    const sandbox = sinon.sandbox.create();
    afterEach("SourcesAuthenticationInfo", () => {
        sandbox.restore();
    });

    it("should return fbAuthenticated info after FACEBOOK_EXPIRE_INFO action ", () => {
        const action = {
            "type": FACEBOOK_EXPIRE_INFO,
            "isValid": false
        };
        const response = sourcesAuthenticationInfo({}, action);
        assert.isFalse(response.facebook);
    });

    it("should return twitterAuthenticated value after TWITTER_AUTHENTICATION action", () => {
        const action = {
            "type": TWITTER_AUTHENTICATION,
            "twitterAuthenticated": true
        };
        const response = sourcesAuthenticationInfo({}, action);
        assert.isTrue(response.twitter);
    });

    it("should return the default state when there is no action type", () => {
        const response = sourcesAuthenticationInfo({}, {});
        assert.deepEqual(response, {});
    });
});
