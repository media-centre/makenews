import TwitterClient from "../../src/twitter/TwitterClient";
import sinon from "sinon";
import OAuth from "oauth";
import TwitterLogin from "../../src/twitter/TwitterLogin";
import { assert } from "chai";
import nock from "nock";
import ApplicationConfig from "../../src/config/ApplicationConfig";
import HttpResponseHanlder from "../../../common/src/HttpResponseHandler";
import TwitterParser from "../../src/twitter/TwitterParser";

describe("TwitterClient", () => {
    let sandbox = null, twitterClient = null, tokenInfo = null, oauth = null, twitterParser = null;
    describe("FetchHandles", () => {
        let getAccessMock = null, createOAuthMock = null;
        beforeEach(() => {
            sandbox = sinon.sandbox.create();
            twitterClient = new TwitterClient();
            tokenInfo = ["oauthAccessToken", "oauthAccessSecretToken"];
            oauth = new OAuth.OAuth(
                "https://api.twitter.com/oauth/request_token",
                "https://api.twitter.com/oauth/access_token",
                ApplicationConfig.instance().twitter().consumerKey,
                ApplicationConfig.instance().twitter().consumerSecret,
                "1.0A",
                null,
                "HMAC-SHA1");
            twitterParser = TwitterParser.instance();
        });

        afterEach(() => {
            sandbox.restore();
        });

        it("should fetch handles from the twitter user", async () => {
            let parsedData = [{
                "id": 1277389,
                "id_str": 1277389,
                "name": "testUser",
                "picture": {
                    "data": {
                        "url": "imagelink"
                    }
                }
            }];
            let resultData = {
                "docs": parsedData,
                "paging": { "page": 2 },
                "twitterPreFirstId": 1277389
            };

            getAccessMock = sandbox.mock(twitterClient).expects("getAccessTokenAndSecret").returns(Promise.resolve(tokenInfo));
            createOAuthMock = sandbox.mock(TwitterLogin).expects("createOAuthInstance").returns(oauth);
            sandbox.mock(TwitterParser).expects("instance").returns(twitterParser);
            sandbox.mock(twitterParser).expects("parseHandle").returns(parsedData);

            nock("https://api.twitter.com/1.1")
                .get("/users/search.json?q=keyword&page=1")
                .reply(HttpResponseHanlder.codes.OK, [{
                    "id": 1277389,
                    "id_str": 1277389,
                    "name": "testUser",
                    "location": "india"
                }]);

            try {
                let handles = await twitterClient.fetchHandles("userName", "keyword", 1, 0); //eslint-disable-line no-magic-numbers
                assert.deepEqual(resultData, handles);
                getAccessMock.verify();
                createOAuthMock.verify();
            } catch(error) {
                assert.fail(error);
            }
        });

        it("should return empty object if results are matching with previous result", async () => {
            let resultData = { "docs": [] };

            getAccessMock = sandbox.mock(twitterClient).expects("getAccessTokenAndSecret").returns(Promise.resolve(tokenInfo));
            createOAuthMock = sandbox.mock(TwitterLogin).expects("createOAuthInstance").returns(oauth);

            nock("https://api.twitter.com/1.1")
                .get("/users/search.json?q=india&page=1")
                .reply(HttpResponseHanlder.codes.OK, [{
                    "id": 1277389,
                    "id_str": 1277389,
                    "name": "testUser",
                    "location": "india"
                }]);
            try {
                let result = await twitterClient.fetchHandles("userName", "india", 1, 1277389);  //eslint-disable-line no-magic-numbers
                assert.deepEqual(resultData, result);
                getAccessMock.verify();
                createOAuthMock.verify();
            } catch(error) {
                assert.fail(error);
            }
        });

        it("should reject with an error if oauth get returns error", async () => {
            getAccessMock = sandbox.mock(twitterClient).expects("getAccessTokenAndSecret").returns(Promise.resolve(tokenInfo));
            createOAuthMock = sandbox.mock(TwitterLogin).expects("createOAuthInstance").returns(oauth);

            nock("https://api.twitter.com/1.1")
                .get("/users/search.json?q=india&page=1")
                .reply(HttpResponseHanlder.codes.BAD_REQUEST, {
                    "message": "no result"
                });

            try {
                await twitterClient.fetchHandles("userName", "india", 1, 0);  //eslint-disable-line no-magic-numbers
            } catch(error) {
                assert.deepEqual("no result", error);
            }
        });

        it("should reject with an error if getAccessToken rejects with an error", async () => {
            sandbox.mock(twitterClient).expects("getAccessTokenAndSecret").returns(Promise.reject("Error"));

            try {
                await twitterClient.fetchHandles("userName", "keyword", 1, 123);  //eslint-disable-line no-magic-numbers
                assert.fail();
            } catch(error) {
                assert.deepEqual(error, "Error");
            }
        });
    });

    describe("Fetch Tweets", () => {
        beforeEach(() => {
            // 92708272  msdhoni
            sandbox = sinon.sandbox.create();
            twitterClient = new TwitterClient();
            tokenInfo = ["oauthTestToken", "oauthAccessTokenSecret"];
            oauth = new OAuth.OAuth(
                "https://api.twitter.com/oauth/request_token",
                "https://api.twitter.com/oauth/access_token",
                ApplicationConfig.instance().twitter().consumerKey,
                ApplicationConfig.instance().twitter().consumerSecret,
                "1.0A",
                null,
                "HMAC-SHA1");
            twitterParser = TwitterParser.instance();
        });

        afterEach(() => {
            sandbox.restore();
        });

        it("should fetch tweets for the given url", async () => {
            let parsedTweets = [{
                "_id": 1277389,
                "docType": "feed",
                "sourceType": "twitter",
                "pubDate": "Fri Dec 09 07:24:44 +0000 2016",
                "description": "Just posted a photo https://t.co/7X7kvw9Plf"
            }];
            let sourceId = "123";
            let twitterRespone = [{
                "id": 1277389,
                "id_str": 1277389,
                "created_at": "Fri Dec 09 07:24:44 +0000 2016",
                "text": "Just posted a photo https://t.co/7X7kvw9Plf"
            }];

            nock("https://api.twitter.com/1.1")
                .get("/statuses/user_timeline.json?count=100&exclude_replies=true&include_rts=false&since:2017-1-9&user_id=123")
                .reply(HttpResponseHanlder.codes.OK, twitterRespone);

            sandbox.mock(twitterClient).expects("getAccessTokenAndSecret").returns(Promise.resolve(tokenInfo));
            sandbox.mock(TwitterLogin).expects("createOAuthInstance").returns(oauth);
            sandbox.mock(TwitterParser).expects("instance").returns(twitterParser);
            sandbox.mock(twitterParser).expects("parseTweets")
                .withExactArgs(sourceId, twitterRespone)
                .returns(parsedTweets);

            try {
                let tweetData = await twitterClient.fetchTweets("123", "userName", 1483947627341); //eslint-disable-line no-magic-numbers
                assert.deepEqual(parsedTweets, tweetData);
            } catch(error) {
                assert.fail(error);
            }

        });

        it("should fetch feeds for the given hash tag", async () => {
            let twitterRespone = {
                "statuses": [{
                    "id": 1277389,
                    "id_str": 1277389,
                    "created_at": "Fri Dec 09 07:24:44 +0000 2016",
                    "text": "Just posted a photo https://t.co/7X7kvw9Plf"
                }]
            };
            let parsedTweets = [{
                "_id": 1277389,
                "docType": "feed",
                "sourceType": "twitter",
                "pubDate": "Fri Dec 09 07:24:44 +0000 2016",
                "description": "Just posted a photo https://t.co/7X7kvw9Plf"
            }];

            nock("https://api.twitter.com/1.1")
                .get("/search/tweets.json?q=%23dhoni&count=100&filter:retweets&since:2017-1-9")
                .reply(HttpResponseHanlder.codes.OK, twitterRespone);

            sandbox.mock(twitterClient).expects("getAccessTokenAndSecret").returns(Promise.resolve(tokenInfo));
            sandbox.mock(TwitterLogin).expects("createOAuthInstance").returns(oauth);
            sandbox.mock(TwitterParser).expects("instance").returns(twitterParser);
            sandbox.mock(twitterParser).expects("parseTweets")
                .withExactArgs("#dhoni", twitterRespone.statuses)
                .returns(parsedTweets);
            try {
                let tweetData = await twitterClient.fetchTweets("#dhoni", "userName", 1483947627341); //eslint-disable-line no-magic-numbers
                assert.deepEqual(parsedTweets, tweetData);
            } catch(error) {
                assert.fail(error);
            }
        });

        it("should reject with an error if oauth get returns error", async () => {
            sandbox.mock(twitterClient).expects("getAccessTokenAndSecret").returns(Promise.resolve(tokenInfo));
            sandbox.mock(TwitterLogin).expects("createOAuthInstance").returns(oauth);

            nock("https://api.twitter.com/1.1")
                .get("/statuses/user_timeline.json?count=100&exclude_replies=true&include_rts=false&since:2017-1-9&user_id=dhoni")
                .reply(HttpResponseHanlder.codes.BAD_REQUEST, {
                    "message": "could not authenticate you"
                });
            try {
                await twitterClient.fetchTweets("dhoni", "userName", 1483947627341); //eslint-disable-line no-magic-numbers
                assert.fail();
            } catch(error) {
                assert.deepEqual("could not authenticate you", error);
            }
        });

        it("should reject with an error if getAccessToken rejects with an error", async () => {
            sandbox.mock(twitterClient).expects("getAccessTokenAndSecret").returns(Promise.reject("Error"));

            try {
                await twitterClient.fetchHandles();
            } catch(error) {
                assert.deepEqual(error, "Error");
            }
        });
    });
});
