import TwitterClient from "../../src/twitter/TwitterClient";
import sinon from "sinon";
import OAuth from "OAuth";
import TwitterLogin from "../../src/twitter/TwitterLogin";
import { assert } from "chai";
import ApplicationConfig from "../../src/config/ApplicationConfig";

describe("TwitterClient", () => {
    let sandbox = null;
    afterEach(() => {
        sandbox.restore();
    });
    it("should fetch followers from the twitter user", () => {
        let resultData = {
            "docs": [{
                "id": 1277389,
                "name": "testUser",
                "location": "india"
            }],
            "paging": 4
        };
        let tokenInfo = { "oauthAccessToken": "testToken", "oauthAccessTokenSecret": "testSecretToken" };
        let oauth = new OAuth.OAuth(
            "https://api.twitter.com/oauth/request_token",
            "https://api.twitter.com/oauth/access_token",
            ApplicationConfig.instance().twitter().consumerKey,
            ApplicationConfig.instance().twitter().consumerSecret,
            "1.0A",
            null,
            "HMAC-SHA1");
        sandbox = sinon.sandbox.create();
        let twitterClient = new TwitterClient();
        sandbox.mock(twitterClient).expects("getAccessTokenAndSecret").returns(Promise.resolve(tokenInfo));
        sandbox.mock(TwitterLogin).expects("createOAuthInstance").returns(oauth);
        sandbox.mock(oauth).expects("get").returns(Promise.resolve(resultData));

        twitterClient.fetchFollowers().then(followers => {
            assert.deepEqual(followers, resultData);
        });

    });

    it("should reject with an erro if oauth get returns error", () => {
        let tokenInfo = { "oauthAccessToken": "testToken", "oauthAccessTokenSecret": "testSecretToken" };
        let oauth = new OAuth.OAuth(
            "https://api.twitter.com/oauth/request_token",
            "https://api.twitter.com/oauth/access_token",
            ApplicationConfig.instance().twitter().consumerKey,
            ApplicationConfig.instance().twitter().consumerSecret,
            "1.0A",
            null,
            "HMAC-SHA1");
        sandbox = sinon.sandbox.create();
        let twitterClient = new TwitterClient();
        sandbox.mock(twitterClient).expects("getAccessTokenAndSecret").returns(Promise.resolve(tokenInfo));
        sandbox.mock(TwitterLogin).expects("createOAuthInstance").returns(oauth);
        sandbox.mock(oauth).expects("get").returns(Promise.reject("Error"));

        twitterClient.fetchFollowers().catch(error => {
            assert.deepEqual(error, "Error");
        });
    });

    it("should reject with an error if getAccessToken rejects with an error", () => {
        sandbox = sinon.sandbox.create();
        let twitterClient = new TwitterClient();
        sandbox.mock(twitterClient).expects("getAccessTokenAndSecret").returns(Promise.reject("Error"));

        twitterClient.fetchFollowers().catch(error => {
            assert.deepEqual(error, "Error");
        });
    });
});
