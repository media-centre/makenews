/* eslint max-nested-callbacks:0 */
import TwitterClient from "../../src/js/twitter/TwitterClient";
import AjaxClient from "../../src/js/utils/AjaxClient";
import AppSessionStorage from "../../src/js/utils/AppSessionStorage";
import { assert, expect } from "chai";
import sinon from "sinon";

describe("TwitterClient", () => {
    
    describe("fetchTweets", () => {
        let sandbox = null, twitterClient = null, ajaxClient = null, url = null;
        let twitterData = { "data": "feeds" };

        beforeEach("fetchTweets", () => {
            twitterClient = TwitterClient.instance();
            sandbox = sinon.sandbox.create();
            ajaxClient = new AjaxClient(url, true);
            sandbox.stub(AjaxClient, "instance").returns(ajaxClient);
            let appSessionStorage = new AppSessionStorage();
            sandbox.stub(AppSessionStorage, "instance").returns(appSessionStorage);
            sandbox.stub(appSessionStorage, "getValue").returns("test");
        });

        afterEach("fetchTweets", () => {
            sandbox.restore();
        });

        it("should fetch the twitter feeds of a given url", () => {
            url = "/twitter-feeds";
            let ajaxGetStub = sandbox.stub(ajaxClient, "get");
            ajaxGetStub.withArgs({ "url": url, "userName": "test" }).returns(Promise.resolve(twitterData));

            return twitterClient.fetchTweets(url).then((response) => {
                assert.deepEqual(twitterData, response);
            });
        });

        it("should fetch batch of Twitter feeds", () => {
            let ajaxPostStub = sandbox.stub(ajaxClient, "post");
            let twitterUrls = { "data": [{ "url": "twitterUrl1", "latestFeedTimestamp": "2016-01-16T07:36:17+00:00", "_id": "1" },
                { "url": "twitterUrl2", "latestFeedTimestamp": "2016-01-18T07:36:17+00:00", "_id": "2" }] };
            let headers = {
                "Accept": "application/json",
                "Content-type": "application/json"
            };
            ajaxPostStub.withArgs(headers, twitterUrls).returns(Promise.resolve(twitterData));
            return twitterClient.fetchBatchTweets(twitterUrls).then((feeds) => {
                assert.deepEqual(twitterData, feeds);
            });
        });
    });
    
    describe("requestToken", () => {
        it("should get oauth_token from twitter", () => {
            let response = { "authorizeUrl": "url" };
            let clientCallbackUrl = "clientCallbackUrl", serverCallbackUrl = "serverCallbackUrl", userName = "username";
            let query = { "clientCallbackUrl": clientCallbackUrl, "serverCallbackUrl": serverCallbackUrl, "userName": userName };
            let sandbox = sinon.sandbox.create();
            let ajaxMock = new AjaxClient("/twitter-request-token", true);
            let ajaxInstanceMock = sandbox.mock(AjaxClient).expects("instance");
            ajaxInstanceMock.withArgs("/twitter-request-token").returns(ajaxMock);
            let ajaxGetMock = sandbox.mock(ajaxMock).expects("get");
            ajaxGetMock.withExactArgs(query).returns(Promise.resolve(response));
            return Promise.resolve(TwitterClient.instance().requestToken(clientCallbackUrl, serverCallbackUrl, userName)).then((authUrlObj) => {
                expect(authUrlObj.authorizeUrl).to.eq("url");
                ajaxInstanceMock.verify();
                ajaxGetMock.verify();
                sandbox.restore();
            });
        });
    });
});
