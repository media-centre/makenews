import TwitterClient from "../../src/twitter/TwitterClient";
import sinon from "sinon";
import OAuth from "oauth";
import TwitterLogin from "../../src/twitter/TwitterLogin";
import { assert } from "chai";
import ApplicationConfig from "../../src/config/ApplicationConfig";

describe("TwitterClient", () => {
    let sandbox = null, twitterClient = null, tokenInfo = null, oauth = null;
    beforeEach(() => {
        sandbox = sinon.sandbox.create();
        twitterClient = new TwitterClient();
        tokenInfo = { "oauthAccessToken": "testToken", "oauthAccessTokenSecret": "testSecretToken" };
        oauth = new OAuth.OAuth(
            "https://api.twitter.com/oauth/request_token",
            "https://api.twitter.com/oauth/access_token",
            ApplicationConfig.instance().twitter().consumerKey,
            ApplicationConfig.instance().twitter().consumerSecret,
            "1.0A",
            null,
            "HMAC-SHA1");
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("should fetch handles from the twitter user", () => {
        let resultData = {
            "docs": [{
                "id": 1277389,
                "name": "testUser",
                "location": "india"
            }],
            "paging": 4
        };

        sandbox.mock(twitterClient).expects("getAccessTokenAndSecret").returns(Promise.resolve(tokenInfo));
        sandbox.mock(TwitterLogin).expects("createOAuthInstance").returns(oauth);
        sandbox.mock(oauth).expects("get").returns(Promise.resolve(resultData));

        twitterClient.fetchHandles().then(handles => {
            assert.deepEqual(handles, resultData);
        });

    });

    it("should return empty object if results are matching with previous result", () => {
        let resultData = { "docs": [] };
        sandbox.mock(twitterClient).expects("getAccessTokenAndSecret").returns(Promise.resolve(tokenInfo));
        sandbox.mock(oauth).expects("get").returns(Promise.resolve(resultData));
        twitterClient.fetchHandles("userName", "india", 1, 123).then(result => { //eslint-disable-line no-magic-numbers
            assert.deepEqual(result, resultData);
        });
    });

    it("should reject with an error if oauth get returns error", () => {
        sandbox.mock(twitterClient).expects("getAccessTokenAndSecret").returns(Promise.resolve(tokenInfo));
        sandbox.mock(TwitterLogin).expects("createOAuthInstance").returns(oauth);
        sandbox.mock(oauth).expects("get").returns(Promise.reject("Error"));

        twitterClient.fetchHandles().catch(error => {
            assert.deepEqual(error, "Error");
        });
    });

    it("should reject with an error if getAccessToken rejects with an error", () => {
        sandbox.mock(twitterClient).expects("getAccessTokenAndSecret").returns(Promise.reject("Error"));

        twitterClient.fetchHandles().catch(error => {
            assert.deepEqual(error, "Error");
        });
    });
});
