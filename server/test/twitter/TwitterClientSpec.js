import TwitterClient from "../../src/twitter/TwitterClient";
import sinon from "sinon";
import OAuth from "oauth";
import TwitterLogin from "../../src/twitter/TwitterLogin";
import { assert } from "chai";
import nock from "nock";
import ApplicationConfig from "../../src/config/ApplicationConfig";
import LogTestHelper from "../helpers/LogTestHelper";
import HttpResponseHanlder from "../../../common/src/HttpResponseHandler";
import TwitterParser from "../../src/twitter/TwitterParser";
import DateUtil from "../../src/util/DateUtil";
import * as Constants from "./../../src/util/Constants";

describe("TwitterClient", () => {
    let sandbox = null, twitterClient = null, tokenInfo = null, oauth = null, twitterParser = null;
    const logger = LogTestHelper.instance();
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
                .reply(HttpResponseHanlder.codes.BAD_REQUEST, "no result");

            try {
                await twitterClient.fetchHandles("userName", "india", 1, 0);  //eslint-disable-line no-magic-numbers
            } catch(error) {
                assert.deepEqual("no result", error.data);
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
        const twitterFeedPerReqLimit = Constants.maxFeedsPerRequest.twitter;
        beforeEach(() => {
            sandbox = sinon.sandbox.create();
            twitterClient = new TwitterClient();

            sandbox.stub(TwitterClient, "logger").returns(logger);

            const applicationConfig = new ApplicationConfig();
            sandbox.stub(ApplicationConfig, "instance").returns(applicationConfig);
            sinon.stub(applicationConfig, "twitter").returns({
                "url": "https://api.twitter.com/1.1",
                "authenticateUrl": "https://api.twitter.com/oauth/authenticate",
                "consumerKey": "consumerKey",
                "consumerSecret": "consumerSecret",
                "maxFeeds": 4
            });

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
            Constants.maxFeedsPerRequest.twitter = 2;
        });

        afterEach(() => {
            Constants.maxFeedsPerRequest.twitter = twitterFeedPerReqLimit;
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

            //eslint-disable-next-line no-magic-numbers
            sandbox.stub(DateUtil, "getCurrentTimeInSeconds").returns(1487927102);
            const expctedData = {
                "docs": parsedTweets,
                "paging": { "sinceId": 1277389, "since": 1487927102 }
            };
            let sourceId = "123";
            let twitterRespone = [{
                "id": 1277389,
                "id_str": 1277389,
                "created_at": "Fri Dec 09 07:24:44 +0000 2016",
                "text": "Just posted a photo https://t.co/7X7kvw9Plf"
            }];

            nock("https://api.twitter.com/1.1")
                .get("/statuses/user_timeline.json?count=100&exclude_replies=true&include_rts=false&since=2017-1-9&since_id=1&user_id=123")
                .reply(HttpResponseHanlder.codes.OK, twitterRespone);

            sandbox.mock(twitterClient).expects("getAccessTokenAndSecret").returns(Promise.resolve(tokenInfo));
            sandbox.mock(TwitterLogin).expects("createOAuthInstance").returns(oauth);
            sandbox.mock(TwitterParser).expects("instance").returns(twitterParser);
            sandbox.mock(twitterParser).expects("parseTweets")
                .withExactArgs(sourceId, twitterRespone)
                .returns(parsedTweets);

            const tweetData = await twitterClient.fetchTweets("123", "userName", 1483947627341); //eslint-disable-line no-magic-numbers
            assert.deepEqual(tweetData, expctedData);
        });

        it("should fetch tweets for the given url with the since id", async () => {
            const expectedData = {
                "docs": [{
                    "_id": "835103042471096320",
                    "docType": "feed",
                    "sourceType": "twitter",
                    "description": "",
                    "title": "just posted a photo https://t.co/7x7kvw9plf",
                    "link": "https://twitter.com/123/status/835103042471096320",
                    "pubDate": "2016-12-09T07:24:44.000Z",
                    "tags": ["user1"],
                    "images": [],
                    "videos": [],
                    "sourceId": "123"
                }],
                "paging": {
                    "sinceId": "835103042471096320",
                    "since": 1487927102
                }
            };
            //eslint-disable-next-line no-magic-numbers
            sandbox.stub(DateUtil, "getCurrentTimeInSeconds").returns(1487927102);
            const sinceid = "835103042471096320";
            const timestamp = 1483947627341;

            let twitterResponse = [{
                "id": 835103042471096320,
                "id_str": "835103042471096320",
                "created_at": "fri dec 09 07:24:44 +0000 2016",
                "text": "just posted a photo https://t.co/7x7kvw9plf",
                "user": {
                    "name": "user1"
                },
                "entities": {
                    "hashtags": []
                }
            }];

            nock("https://api.twitter.com/1.1")
                .get(`/statuses/user_timeline.json?count=100&exclude_replies=true&include_rts=false&since=2017-1-9&since_id=${sinceid}&user_id=123`)
                .reply(HttpResponseHanlder.codes.ok, twitterResponse);
            sandbox.mock(twitterClient).expects("getAccessTokenAndSecret").returns(Promise.resolve(tokenInfo));
            sandbox.mock(TwitterLogin).expects("createOAuthInstance").returns(oauth);
            const tweetData = await twitterClient.fetchTweets("123", "username", timestamp, sinceid);
            assert.deepEqual(tweetData, expectedData);
        });

        it("should return empty docs and same sinceId if twitter gives empty feeds", async () => {
            const twitterResponse = {
                "statuses": [],
                "search_metadata": {
                    "max_id_str": "835103042471096320"
                }
            };
            const sinceId = "835103042471012342";

            const expectedData = {
                "docs": [],
                "paging": {
                    "sinceId": sinceId,
                    "since": 1487927102
                }
            };
            //eslint-disable-next-line no-magic-numbers
            sandbox.stub(DateUtil, "getCurrentTimeInSeconds").returns(1487927102);
            nock("https://api.twitter.com/1.1")
                .get(`/search/tweets.json?q=%23dhoni&count=100&filter=retweets&since=2017-1-9&since_id=${sinceId}`)
                .reply(HttpResponseHanlder.codes.OK, twitterResponse);

            sandbox.mock(twitterClient).expects("getAccessTokenAndSecret").returns(Promise.resolve(tokenInfo));
            sandbox.mock(TwitterLogin).expects("createOAuthInstance").returns(oauth);

            const tweetData = await twitterClient.fetchTweets("#dhoni", "userName", 1483947627341, sinceId); //eslint-disable-line no-magic-numbers
            assert.deepEqual(tweetData, expectedData);
        });

        it("should fetch tweets for the given url recursively", async () => {
            let expectedData = {
                "docs": [{
                    "_id": "835103042471096320",
                    "docType": "feed",
                    "sourceType": "twitter",
                    "description": "",
                    "title": "Just posted a photo https://t.co/7X7kvw9Plf",
                    "link": "https://twitter.com/123/status/835103042471096320",
                    "pubDate": "2016-12-09T07:24:44.000Z",
                    "tags": ["user1"],
                    "images": [],
                    "videos": [],
                    "sourceId": "123"
                }, {
                    "_id": "835103042474521902",
                    "docType": "feed",
                    "sourceType": "twitter",
                    "description": "",
                    "title": "This is my post",
                    "link": "https://twitter.com/123/status/835103042474521902",
                    "pubDate": "2016-12-08T07:14:44.000Z",
                    "tags": ["user1"],
                    "images": [],
                    "videos": [],
                    "sourceId": "123"
                }, {
                    "_id": "835103042471014222",
                    "docType": "feed",
                    "sourceType": "twitter",
                    "description": "",
                    "title": "Just posted a photo https://t.co/7X7kvw9Plf",
                    "link": "https://twitter.com/123/status/835103042471014222",
                    "pubDate": "2016-12-09T07:24:44.000Z",
                    "tags": ["user1"],
                    "images": [],
                    "videos": [],
                    "sourceId": "123"
                }],
                "paging": {
                    "sinceId": "835103042471096320",
                    "since": 1487927102
                }
            };
            //eslint-disable-next-line no-magic-numbers
            sandbox.stub(DateUtil, "getCurrentTimeInSeconds").returns(1487927102);
            const sinceId = "835103042471096320";
            const timestamp = 1483947627341;

            const twitterResponse1 = [{
                "id": 835103042471096320,
                "id_str": "835103042471096320",
                "created_at": "Fri Dec 09 07:24:44 +0000 2016",
                "text": "Just posted a photo https://t.co/7X7kvw9Plf",
                "user": {
                    "name": "user1"
                },
                "entities": {
                    "hashtags": []
                }
            }, {
                "id": 835103042474521902,
                "id_str": "835103042474521902",
                "created_at": "Fri Dec 08 07:14:44 +0000 2016",
                "text": "This is my post",
                "user": {
                    "name": "user1"
                },
                "entities": {
                    "hashtags": []
                }
            }];

            const twitterResponse2 = [{
                "id": 835103042471014222,
                "id_str": "835103042471014222",
                "created_at": "Fri Dec 09 07:24:44 +0000 2016",
                "text": "Just posted a photo https://t.co/7X7kvw9Plf",
                "user": {
                    "name": "user1"
                },
                "entities": {
                    "hashtags": []
                }
            }];

            const url = `/statuses/user_timeline.json?count=100&exclude_replies=true&include_rts=false&since=2017-1-9&since_id=${sinceId}&user_id=123`;
            nock("https://api.twitter.com/1.1")
                .get(url)
                .reply(HttpResponseHanlder.codes.OK, twitterResponse1)
                .get(`${url}&max_id:${twitterResponse1[1].id_str}`) //eslint-disable-line no-magic-numbers
                .reply(HttpResponseHanlder.codes.OK, twitterResponse2);
            sandbox.mock(twitterClient).expects("getAccessTokenAndSecret").returns(Promise.resolve(tokenInfo));
            sandbox.mock(TwitterLogin).expects("createOAuthInstance").returns(oauth);

            let tweetData = await twitterClient.fetchTweets("123", "userName", timestamp, sinceId);
            assert.deepEqual(tweetData, expectedData);
        });

        it("should fetch tweets for the given hashtag recursively", async () => {
            let expectedData = {
                "docs": [{
                    "_id": "835103042471096320",
                    "docType": "feed",
                    "sourceType": "twitter",
                    "description": "",
                    "title": "Just posted a photo https://t.co/7X7kvw9Plf",
                    "link": "https://twitter.com/123/status/835103042471096320",
                    "pubDate": "2016-12-09T07:24:44.000Z",
                    "tags": ["user1", "hash"],
                    "images": [],
                    "videos": [],
                    "sourceId": "123"
                }, {
                    "_id": "835103042474521902",
                    "docType": "feed",
                    "sourceType": "twitter",
                    "description": "",
                    "title": "This is my post",
                    "link": "https://twitter.com/123/status/835103042474521902",
                    "pubDate": "2016-12-08T07:14:44.000Z",
                    "tags": ["user1", "hash"],
                    "images": [],
                    "videos": [],
                    "sourceId": "123"
                }, {
                    "_id": "835103042471014222",
                    "docType": "feed",
                    "sourceType": "twitter",
                    "description": "",
                    "title": "Just posted a photo https://t.co/7X7kvw9Plf",
                    "link": "https://twitter.com/123/status/835103042471014222",
                    "pubDate": "2016-12-09T07:24:44.000Z",
                    "tags": ["user1", "hash"],
                    "images": [],
                    "videos": [],
                    "sourceId": "123"
                }],
                "paging": {
                    "sinceId": "835103042471096320",
                    "since": 1487927102
                }
            };
            //eslint-disable-next-line no-magic-numbers
            sandbox.stub(DateUtil, "getCurrentTimeInSeconds").returns(1487927102);
            const sinceId = "835103042471096320";
            const timestamp = 1483947627341;

            const twitterResponse1 = {
                "statuses": [{
                    "id": 835103042471096320,
                    "id_str": "835103042471096320",
                    "created_at": "Fri Dec 09 07:24:44 +0000 2016",
                    "text": "Just posted a photo https://t.co/7X7kvw9Plf",
                    "user": {
                        "name": "user1"
                    },
                    "entities": {
                        "hashtags": [{ "text": "hash" }]
                    }
                }, {
                    "id": 835103042474521902,
                    "id_str": "835103042474521902",
                    "created_at": "Fri Dec 08 07:14:44 +0000 2016",
                    "text": "This is my post",
                    "user": {
                        "name": "user1"
                    },
                    "entities": {
                        "hashtags": [{ "text": "hash" }]
                    }
                }],
                "search_metadata": {
                    "completed_in": 0.013,
                    "max_id": 835103042474521902,
                    "max_id_str": "835103042474521902",
                    "query": "hash",
                    "refresh_url": "?since_id=836108860427399174&q=hash&include_entities=1",
                    "count": 15,
                    "since_id": 0,
                    "since_id_str": "0"
                }
            };

            const twitterResponse2 = {
                "statuses": [{
                    "id": 835103042471014222,
                    "id_str": "835103042471014222",
                    "created_at": "Fri Dec 09 07:24:44 +0000 2016",
                    "text": "Just posted a photo https://t.co/7X7kvw9Plf",
                    "user": {
                        "name": "user1"
                    },
                    "entities": {
                        "hashtags": [{ "text": "hash" }]
                    }
                }],
                "search_metadata": {
                    "completed_in": 0.013,
                    "max_id": 835103042471014222,
                    "max_id_str": "835103042471014222",
                    "query": "hash",
                    "refresh_url": "?since_id=836108860427399174&q=hash&include_entities=1",
                    "count": 15,
                    "since_id": 0,
                    "since_id_str": "0"
                }
            };

            const url = `/statuses/user_timeline.json?count=100&exclude_replies=true&include_rts=false&since=2017-1-9&since_id=${sinceId}&user_id=123`;
            const lastTweetIndex = 1;
            nock("https://api.twitter.com/1.1")
                .get(url)
                .reply(HttpResponseHanlder.codes.OK, twitterResponse1)
                .get(`${url}&max_id:${twitterResponse1.statuses[lastTweetIndex].id_str}`)
                .reply(HttpResponseHanlder.codes.OK, twitterResponse2);
            sandbox.mock(twitterClient).expects("getAccessTokenAndSecret").returns(Promise.resolve(tokenInfo));
            sandbox.mock(TwitterLogin).expects("createOAuthInstance").returns(oauth);

            let tweetData = await twitterClient.fetchTweets("123", "userName", timestamp, sinceId);
            assert.deepEqual(tweetData, expectedData);
        });

        it("should fetch tweets for the given hashtag recursively till the recursion limit", async () => {
            let expectedData = {
                "docs": [{
                    "_id": "835103042471096320",
                    "docType": "feed",
                    "sourceType": "twitter",
                    "description": "",
                    "title": "Just posted a photo https://t.co/7X7kvw9Plf",
                    "link": "https://twitter.com/123/status/835103042471096320",
                    "pubDate": "2016-12-09T07:24:44.000Z",
                    "tags": ["user1", "hash"],
                    "images": [],
                    "videos": [],
                    "sourceId": "123"
                }, {
                    "_id": "835103042474521902",
                    "docType": "feed",
                    "sourceType": "twitter",
                    "description": "",
                    "title": "This is my post",
                    "link": "https://twitter.com/123/status/835103042474521902",
                    "pubDate": "2016-12-08T07:14:44.000Z",
                    "tags": ["user1", "hash"],
                    "images": [],
                    "videos": [],
                    "sourceId": "123"
                }, {
                    "_id": "835103042471014222",
                    "docType": "feed",
                    "sourceType": "twitter",
                    "description": "",
                    "title": "Just posted a photo https://t.co/7X7kvw9Plf",
                    "link": "https://twitter.com/123/status/835103042471014222",
                    "pubDate": "2016-12-09T07:24:44.000Z",
                    "tags": ["user1", "hash"],
                    "images": [],
                    "videos": [],
                    "sourceId": "123"
                }, {
                    "_id": "835103042471013212",
                    "docType": "feed",
                    "sourceType": "twitter",
                    "description": "",
                    "title": "Just posted a photo https://t.co/7X7kvw9Plf",
                    "link": "https://twitter.com/123/status/835103042471013212",
                    "pubDate": "2016-12-09T07:24:44.000Z",
                    "tags": ["user1", "hash"],
                    "images": [],
                    "videos": [],
                    "sourceId": "123"
                }],
                "paging": {
                    "sinceId": "835103042471096320",
                    "since": 1487927102
                }
            };
            //eslint-disable-next-line no-magic-numbers
            sandbox.stub(DateUtil, "getCurrentTimeInSeconds").returns(1487927102);
            const sinceId = "835103042471096320";
            const timestamp = 1483947627341;

            const twitterResponse1 = {
                "statuses": [{
                    "id": 835103042471096320,
                    "id_str": "835103042471096320",
                    "created_at": "Fri Dec 09 07:24:44 +0000 2016",
                    "text": "Just posted a photo https://t.co/7X7kvw9Plf",
                    "user": {
                        "name": "user1"
                    },
                    "entities": {
                        "hashtags": [{ "text": "hash" }]
                    }
                }, {
                    "id": 835103042474521902,
                    "id_str": "835103042474521902",
                    "created_at": "Fri Dec 08 07:14:44 +0000 2016",
                    "text": "This is my post",
                    "user": {
                        "name": "user1"
                    },
                    "entities": {
                        "hashtags": [{ "text": "hash" }]
                    }
                }],
                "search_metadata": {
                    "completed_in": 0.013,
                    "max_id": 835103042474521902,
                    "max_id_str": "835103042474521902",
                    "query": "hash",
                    "refresh_url": "?since_id=836108860427399174&q=hash&include_entities=1",
                    "count": 15,
                    "since_id": 0,
                    "since_id_str": "0"
                }
            };

            const twitterResponse2 = {
                "statuses": [{
                    "id": 835103042471014222,
                    "id_str": "835103042471014222",
                    "created_at": "Fri Dec 09 07:24:44 +0000 2016",
                    "text": "Just posted a photo https://t.co/7X7kvw9Plf",
                    "user": {
                        "name": "user1"
                    },
                    "entities": {
                        "hashtags": [{ "text": "hash" }]
                    }
                }, {
                    "id": 835103042471013212,
                    "id_str": "835103042471013212",
                    "created_at": "Fri Dec 09 07:24:44 +0000 2016",
                    "text": "Just posted a photo https://t.co/7X7kvw9Plf",
                    "user": {
                        "name": "user1"
                    },
                    "entities": {
                        "hashtags": [{ "text": "hash" }]
                    }
                }],
                "search_metadata": {
                    "completed_in": 0.013,
                    "max_id": 835103042471014222,
                    "max_id_str": "835103042471014222",
                    "query": "hash",
                    "refresh_url": "?since_id=836108860427399174&q=hash&include_entities=1",
                    "count": 15,
                    "since_id": 0,
                    "since_id_str": "0"
                }
            };

            const url = `/statuses/user_timeline.json?count=100&exclude_replies=true&include_rts=false&since=2017-1-9&since_id=${sinceId}&user_id=123`;
            const lastTweetIndex = 1;
            nock("https://api.twitter.com/1.1")
                .get(url)
                .reply(HttpResponseHanlder.codes.OK, twitterResponse1)
                .get(`${url}&max_id:${twitterResponse1.statuses[lastTweetIndex].id_str}`)
                .reply(HttpResponseHanlder.codes.OK, twitterResponse2);
            sandbox.mock(twitterClient).expects("getAccessTokenAndSecret").returns(Promise.resolve(tokenInfo));
            sandbox.mock(TwitterLogin).expects("createOAuthInstance").returns(oauth);

            let tweetData = await twitterClient.fetchTweets("123", "userName", timestamp, sinceId);
            assert.deepEqual(tweetData, expectedData);
        });

        it("should fetch log the error message if fetching tweets fails", async () => {
            const expectedData = {
                "docs": [{
                    "_id": "835103042471096320",
                    "docType": "feed",
                    "sourceType": "twitter",
                    "description": "",
                    "title": "Just posted a photo https://t.co/7X7kvw9Plf",
                    "link": "https://twitter.com/#dhoni/status/835103042471096320",
                    "pubDate": "2016-12-09T07:24:44.000Z",
                    "tags": ["user1", "hash"],
                    "images": [],
                    "videos": [],
                    "sourceId": "#dhoni"
                }, {
                    "_id": "835103042474521902",
                    "docType": "feed",
                    "sourceType": "twitter",
                    "description": "",
                    "title": "This is my post",
                    "link": "https://twitter.com/#dhoni/status/835103042474521902",
                    "pubDate": "2016-12-08T07:14:44.000Z",
                    "tags": ["user1", "hash"],
                    "images": [],
                    "videos": [],
                    "sourceId": "#dhoni"
                }],
                "paging": {
                    "sinceId": "835103042471096320",
                    "since": 1487927102
                }
            };
            //eslint-disable-next-line no-magic-numbers
            sandbox.stub(DateUtil, "getCurrentTimeInSeconds").returns(1487927102);

            const twitterResponse = {
                "statuses": [{
                    "id": 835103042471096320,
                    "id_str": "835103042471096320",
                    "created_at": "Fri Dec 09 07:24:44 +0000 2016",
                    "text": "Just posted a photo https://t.co/7X7kvw9Plf",
                    "user": {
                        "name": "user1"
                    },
                    "entities": {
                        "hashtags": [{ "text": "hash" }]
                    }
                }, {
                    "id": 835103042474521902,
                    "id_str": "835103042474521902",
                    "created_at": "Fri Dec 08 07:14:44 +0000 2016",
                    "text": "This is my post",
                    "user": {
                        "name": "user1"
                    },
                    "entities": {
                        "hashtags": [{ "text": "hash" }]
                    }
                }],
                "search_metadata": {
                    "completed_in": 0.013,
                    "max_id": 835103042474521902,
                    "max_id_str": "835103042474521902",
                    "query": "hash",
                    "refresh_url": "?since_id=836108860427399174&q=hash&include_entities=1",
                    "count": 15,
                    "since_id": 0,
                    "since_id_str": "0"
                }
            };
            const url = "/search/tweets.json?q=%23dhoni&count=100&filter=retweets&since=2017-1-9&since_id=1";
            const lastTweetIndex = 1;
            nock("https://api.twitter.com/1.1")
                .get(url)
                .reply(HttpResponseHanlder.codes.OK, twitterResponse)
                .get(`${url}&max_id:${twitterResponse.statuses[lastTweetIndex].id_str}`)
                .reply(HttpResponseHanlder.codes.BAD_REQUEST, "could not authenticate you");

            sandbox.mock(twitterClient).expects("getAccessTokenAndSecret").returns(Promise.resolve(tokenInfo));
            sandbox.mock(TwitterLogin).expects("createOAuthInstance").returns(oauth);
            const loggerMock = sandbox.mock(logger).expects("error")
                .withExactArgs("TwitterClient:: error fetching feeds for %s", "#dhoni");

            const tweetData = await twitterClient.fetchTweets("#dhoni", "userName", 1483947627341); //eslint-disable-line no-magic-numbers
            loggerMock.verify();
            assert.deepEqual(tweetData, expectedData);
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
