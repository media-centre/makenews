import TwitterRequestHandler from "../../src/twitter/TwitterRequestHandler";
import TwitterClient from "../../src/twitter/TwitterClient";
import { userDetails } from "../../src/Factory";
import sinon from "sinon";
import { assert } from "chai";

describe("TwitterRequestHandler", () => {
    let sandbox = null, userName = null, userObj = null, keyword = null, page = null, preFirstId = null;
    describe("FetchHandlesRequest", () => {

        beforeEach("FetchHandlesRequest", () => {
            sandbox = sinon.sandbox.create();
            userName = "testUser";
            userObj = { "userName": userName };
            keyword = "keyword";
            page = 1;  //eslint-disable-line no-magic-numbers
            preFirstId = 123; //eslint-disable-line no-magic-numbers
            sandbox.mock(userDetails).expects("getUser").returns(userObj);
        });

        afterEach("FetchHandlesRequest", () => {
            sandbox.restore();
        });

        it("should fetch handles list from the twitter", async() => {
            let handles = {
                "users": [{
                    "id": "test",
                    "name": "testAccount",
                    "url": "https:/t.co/ijad"
                }]
            };

            let twitterRequestHandler = new TwitterRequestHandler();
            let twitterClientInstance = new TwitterClient();
            sandbox.mock(TwitterClient).expects("instance").returns(twitterClientInstance);
            sandbox.mock(twitterClientInstance).expects("fetchHandles").withExactArgs(userName, keyword, page, preFirstId).returns(Promise.resolve(handles));
            let data = await twitterRequestHandler.fetchHandlesRequest(userName, keyword, page, preFirstId);
            assert.strictEqual(data, handles);
        });
    });

    describe("FetchTweetsRequest", () => {
        let authSesssion = null, twitterRequestHandler = null, twitterClientInstance = null;
        beforeEach("FetchTweetsRequest", ()=> {
            userName = { "userName": "userName" };
            authSesssion = "AuthSession";
            twitterRequestHandler = TwitterRequestHandler.instance();
            twitterClientInstance = new TwitterClient();
            sandbox = sinon.sandbox.create();
        });

        afterEach("FetchTweetsRequest", () => {
            sandbox.restore();
        });

        it("should fetch tweets from the twitter", async () => {
            let url = "123344";
            let timeStamp = 12345678;
            const sinceId = "8123472382371882392";
            let tweets = [{
                "_id": "812574284300173312",
                "docType": "feed",
                "type": "description",
                "sourceType": "twitter",
                "description": "Harnessing private sector expertise. Govt. to set up 35 new #incubators in existing insts. and 35 new pvt. sector incubators. #startupindia",
                "title": "",
                "link": "https://twitter.com/4667591756/status/812574284300173312",
                "pubDate": "2016-12-24T08:23:00Z",
                "tags": ["incubators", "startupindia"]
            }, {
                "_id": "812613799152783360",
                "docType": "feed",
                "type": "description",
                "sourceType": "twitter",
                "description": "(1/2): Self certification under 6 labour laws formulated for #startups; to be effective after concurrence of states/UTs. #startupindia",
                "title": "",
                "link": "https://twitter.com/4667591756/status/812613799152783360",
                "pubDate": "2016-12-24T11:00:02Z",
                "tags": ["startups", "startupindia"]
            }];
            let getUserMock = sandbox.mock(userDetails).expects("getUser").withExactArgs(authSesssion).returns(userName);
            sandbox.mock(TwitterClient).expects("instance").returns(twitterClientInstance);
            sandbox.mock(twitterClientInstance).expects("fetchTweets")
                .withExactArgs(url, "userName", timeStamp, sinceId).returns(Promise.resolve(tweets));
            const tweetsArray = await twitterRequestHandler.fetchTweetsRequest(url, timeStamp, authSesssion, sinceId);
            assert.deepEqual(tweetsArray, tweets);
            getUserMock.verify();
        });
    });

    describe("fetchFollowings", () => {
        let twitterClient = null, twitterHandler = null, fetchFollowingMock = null;
        userName = "userName";
        const nextCursor = -1;
        const authSession = "authSession";

        beforeEach("fetchFollowings", () => {
            const user = {
                "userName": userName
            };

            twitterClient = TwitterClient.instance();
            sandbox = sinon.sandbox.create();
            twitterHandler = TwitterRequestHandler.instance();
            sandbox.stub(TwitterClient, "instance").returns(twitterClient);
            sandbox.stub(userDetails, "getUser").returns(user);
            fetchFollowingMock = sandbox.mock(twitterClient).expects("fetchFollowings")
                .withExactArgs(userName, nextCursor);
        });

        afterEach("fetchFollowings", () => {
            sandbox.restore();
        });

        it("should return twitter followings", async() => {

            const expectedData = {
                "docs": [],
                "paging": {
                    "page": 0
                }
            };

            fetchFollowingMock.returns(Promise.resolve(expectedData));

            const response = await twitterHandler.fetchFollowings(authSession, nextCursor);

            fetchFollowingMock.verify();
            assert.deepEqual(response, expectedData);
        });

        it("should throw could not get more when error status code is 429", async () => {
            fetchFollowingMock.returns(Promise.reject({ "statusCode": 429, "message": "too many requests" }));
            try {
                await twitterHandler.fetchFollowings(authSession, nextCursor);
                assert.fail();
            } catch(error) {
                assert.deepEqual(error, { "message": "Could not get more handles" });
            }
        });
    });
});
