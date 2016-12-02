/* eslint no-unused-expressions:0, max-nested-callbacks: [2, 5], no-magic-numbers:0 */

import HttpResponseHandler from "../../../common/src/HttpResponseHandler";
import FacebookClient from "../../src/facebook/FacebookClient";
import NodeErrorHandler from "../../src/NodeErrorHandler";
import ApplicationConfig from "../../src/config/ApplicationConfig";
import LogTestHelper from "../helpers/LogTestHelper";
import nock from "nock";
import { assert, expect } from "chai";
import sinon from "sinon";

describe("FacebookClient", () => {
    let accessToken = null, appSecretProof = null, applicationConfigFacebookStub = null, applicationConfig = null;
    before("FacebookClient", () => {
        accessToken = "test_token";
        appSecretProof = "test_secret_proof";
        applicationConfig = new ApplicationConfig();
        sinon.stub(ApplicationConfig, "instance").returns(applicationConfig);
        applicationConfigFacebookStub = sinon.stub(applicationConfig, "facebook");
        applicationConfigFacebookStub.returns({
            "url": "https://graph.facebook.com/v2.8",
            "appSecretKey": "appSecretKey",
            "timeOut": 10
        });
        sinon.stub(FacebookClient, "logger").returns(LogTestHelper.instance());
    });

    after("FacebookClient", () => {
        ApplicationConfig.instance.restore();
        applicationConfig.facebook.restore();
        FacebookClient.logger.restore();
    });

    describe("pageFeeds", () => {
        let remainingUrl = null, userParameters = null, pageId = null;
        before("pageFeeds", () => {
            userParameters = { "fields": "link,message,picture,name,caption,place,tags,privacy,created_time" };
            remainingUrl = "/v2.8/12345678/posts?fields=link,message,picture,name,caption,place,tags,privacy,created_time&access_token=" + accessToken + "&appsecret_proof=" + appSecretProof;
            pageId = "12345678";
        });

        it("should return feeds for a public page", (done) => {
            let nodeErrorHandlerMock = sinon.mock(NodeErrorHandler).expects("noError");
            nodeErrorHandlerMock.returns(true);

            nock("https://graph.facebook.com")
                .get(remainingUrl)
                .reply(HttpResponseHandler.codes.OK, {
                    "data":
                    [{ "message": "test news 1", "id": "163974433696568_957858557641481" },
                            { "message": "test news 2", "id": "163974433696568_957850670975603" }]
                });
            let facebookClient = new FacebookClient(accessToken, appSecretProof);
            facebookClient.pagePosts(pageId, userParameters).then((feeds) => {
                try {
                    assert.strictEqual("test news 1", feeds.data[0].message);
                    assert.strictEqual("test news 2", feeds.data[1].message);
                    nodeErrorHandlerMock.verify();
                    NodeErrorHandler.noError.restore();
                    done();
                } catch(err) {
                    done(err);
                }
            });
        });

        it("should reject the promise if there are any errors from facebook like authentication", (done) => {
            let nodeErrorHandlerMock = sinon.mock(NodeErrorHandler).expects("noError");
            nodeErrorHandlerMock.returns(true);

            nock("https://graph.facebook.com")
                .get(remainingUrl)
                .reply(HttpResponseHandler.codes.BAD_REQUEST, {
                    "error": {
                        "message": "Error validating access token: Session has expired on Thursday, 10-Dec-15 04:00:00 PST. The current time is Thursday, 10-Dec-15 20:23:54 PST.",
                        "type": "OAuthException",
                        "code": 190,
                        "error_subcode": 463,
                        "fbtrace_id": "AWpk5h2ceG6"
                    }
                }
                );

            let facebookClient = new FacebookClient(accessToken, appSecretProof);
            facebookClient.pagePosts(pageId, userParameters).catch((error) => {
                assert.strictEqual("OAuthException", error.type);
                assert.strictEqual("Error validating access token: Session has expired on Thursday, 10-Dec-15 04:00:00 PST. The current time is Thursday, 10-Dec-15 20:23:54 PST.", error.message);
                nodeErrorHandlerMock.verify();
                NodeErrorHandler.noError.restore();
                done();
            });
        });

        it("should reject with error if the facebook node is not available", (done) => {
            let nodeErrorHandlerMock = sinon.mock(NodeErrorHandler).expects("noError");
            nodeErrorHandlerMock.returns(false);

            nock("https://graph.facebook.com")
                .get(remainingUrl)
                .replyWithError({
                    "code": "ETIMEDOUT",
                    "errno": "ETIMEDOUT",
                    "syscall": "connect",
                    "address": "65.19.157.235",
                    "port": 443
                }
                );

            let facebookClient = new FacebookClient(accessToken, appSecretProof);
            facebookClient.pagePosts(pageId, userParameters).catch((error) => {
                assert.strictEqual("ETIMEDOUT", error.code);
                assert.strictEqual("ETIMEDOUT", error.errno);
                nodeErrorHandlerMock.verify();
                NodeErrorHandler.noError.restore();
                done();
            });
        });

        it("should reject if the facebook takes too long to return the data", (done) => {
            nock("https://graph.facebook.com")
                .get(remainingUrl)
                .socketDelay(2000)
                .reply(HttpResponseHandler.codes.OK, {
                    "data":
                    [{ "message": "test news 1", "id": "163974433696568_957858557641481" },
                        { "message": "test news 2", "id": "163974433696568_957850670975603" }]
                });


            let facebookClient = new FacebookClient(accessToken, appSecretProof);
            facebookClient.pagePosts(pageId, userParameters).catch((error) => { //eslint-disable-line
                done();
            });
        });

        it("should throw an error when access token is null", () => {

            let createFacebookClient = () => {
                return new FacebookClient(null, appSecretProof);
            };

            assert.throw(createFacebookClient, Error, "access token or application secret proof can not be null");
        });

        it("should throw an error when application secret proof is null", () => {

            let createFacebookClient = () => {
                return new FacebookClient(accessToken, null);
            };

            assert.throw(createFacebookClient, Error, "access token or application secret proof can not be null");
        });

        it("should reject with error when page name is null", (done) => {

            let facebookClient = new FacebookClient(accessToken, appSecretProof);
            facebookClient.pagePosts(null).catch((error) => {
                assert.strictEqual("page id cannot be empty", error.message);
                done();
            });
        });
    });
    describe("getFacebookId", () => {
        let accessToken1 = null, appSecretProof1 = null, facebookUrl1 = null, remainingUrl = null;
        before("getFacebookId", () => {
            accessToken1 = "test_token";
            appSecretProof1 = "test_secret_proof";
            facebookUrl1 = "http://www.facebook.com/test";
            remainingUrl = "/v2.8/" + facebookUrl1 + "/?access_token=" + accessToken1 + "&appsecret_proof=" + appSecretProof1;
        });

        it("should return id for a public page", (done) => {

            let response = {
                "name": "test_id",
                "id": "12345678"
            };

            nock("https://graph.facebook.com")
                .get(remainingUrl)
                .reply(HttpResponseHandler.codes.OK, response);

            let facebookClient = new FacebookClient(accessToken1, appSecretProof1);
            facebookClient.getFacebookId(facebookUrl1).then((id) => {
                assert.deepEqual(response.id, id);
                done();
            });
        });

        it("should return id for wrong url", (done) => {

            let response = {
                "og_object": {
                    "id": "12345678",
                    "type": "website",
                    "updated_time": "2015-12-22T11:06:53+0000",
                    "url": "http://www.facebook.com/asfdjs"
                },
                "share": {
                    "comment_count": 0,
                    "share_count": 0
                },
                "id": "http://www.facebook.com/asfdjs"
            };

            nock("https://graph.facebook.com")
                .get(remainingUrl)
                .reply(HttpResponseHandler.codes.OK, response);

            let facebookClient = new FacebookClient(accessToken1, appSecretProof1);
            facebookClient.getFacebookId(facebookUrl1).then((id) => {
                assert.deepEqual(response.id, id);
                done();
            });
        });
        it("should rejet if fetching facebook id is taking too longer", (done) => {

            nock("https://graph.facebook.com")
                .get(remainingUrl)
                .socketDelay(2000)
                .reply(HttpResponseHandler.codes.OK, {});

            let facebookClient = new FacebookClient(accessToken1, appSecretProof1);
            facebookClient.getFacebookId(facebookUrl1).catch((error) => { //eslint-disable-line
                done();
            });
        });
    });

    describe("getLongLivedToken", () => {
        let accessToken1 = null, appSecretProof1 = null, remainingUrl = null, appId = null;
        before("getLongLivedToken", () => {
            accessToken1 = "test_token";
            appSecretProof1 = "test_secret_proof";
            appId = "123456";
            remainingUrl = "/v2.8/oauth/access_token?grant_type=fb_exchange_token&client_id=" + appId + "&client_secret=" + appSecretProof1 + "&fb_exchange_token=" + accessToken1;
        });

        it("should return long-lived token for a valid short-lived token", (done) => {

            let response = {
                "access_token": "test token",
                "token_type": "bearer",
                "expires_in": 123456
            };

            nock("https://graph.facebook.com")
                .get(remainingUrl)
                .reply(HttpResponseHandler.codes.OK, response);

            let facebookClient = new FacebookClient(accessToken1, appSecretProof1, appId);
            facebookClient.getLongLivedToken().then((result) => {
                assert.deepEqual(response.id, result.id);
                done();
            });
        });

        it("should reject if long-lived token from fb response is throw error", (done) => {
            nock("https://graph.facebook.com")
                .get(remainingUrl)
                .replyWithError("error");

            let facebookClient = new FacebookClient(accessToken1, appSecretProof1, appId);
            facebookClient.getLongLivedToken().catch((error) => {
                assert.strictEqual(error.message, "error");
                done();
            });
        });
    });

    describe("pageNavigationFeeds", () => {
        let navigationPageUrl = null;
        before("pageNavigationFeeds", () => {
            navigationPageUrl = "https://graph.facebook.com/v2.8/173565992684755/feed?fields=link,message,picture,name,caption,place,tags,privacy,created_time&limit=100&format=json&__paging_token=enc_AdCLZBz7YiUQuPwDZCD0BRu4XDvd5x8sQ7G1Qm5bpkv1j8ZCPnSxnqnAPwsxx7VH1jSyrGYxnuDZAwyuxePYhJeWZBr5cZCdCwF94GiCWpLeZCPv2jnKAZDZD&access_token=CAACEdEose0cBAKqvTZCVPHVHEOtvrt808MILI3d5dKVtB7eMvwQqUPnb9v0rto2bNjY3xL31fIdFkbEMQqc8zmKQMnjTxKp0ZAC2fylrnD4q8QfCEEfzM3OnXsAiV1zLYUohRg9vPDZAVCsZCZAJosVpvrSkjpG4XXVTZAshI8FQPH2iCDQQpBltbLUO1iYLIqFmXWaamadQZDZD&until=1445701972"; //eslint-disable-line
        });
        it("should resolve the feeds of a prev or next page", (done) => {
            nock("https://graph.facebook.com")
            .get("/v2.8/173565992684755/feed?fields=link,message,picture,name,caption,place,tags,privacy,created_time&limit=100&format=json&__paging_token=enc_AdCLZBz7YiUQuPwDZCD0BRu4XDvd5x8sQ7G1Qm5bpkv1j8ZCPnSxnqnAPwsxx7VH1jSyrGYxnuDZAwyuxePYhJeWZBr5cZCdCwF94GiCWpLeZCPv2jnKAZDZD&access_token=CAACEdEose0cBAKqvTZCVPHVHEOtvrt808MILI3d5dKVtB7eMvwQqUPnb9v0rto2bNjY3xL31fIdFkbEMQqc8zmKQMnjTxKp0ZAC2fylrnD4q8QfCEEfzM3OnXsAiV1zLYUohRg9vPDZAVCsZCZAJosVpvrSkjpG4XXVTZAshI8FQPH2iCDQQpBltbLUO1iYLIqFmXWaamadQZDZD&until=1445701972&access_token=" + accessToken + "&appsecret_proof=" + appSecretProof) //eslint-disable-line
            .reply(HttpResponseHandler.codes.OK, {
                "data":
                [{ "message": "test news 1", "id": "163974433696568_957858557641481" },
                    { "message": "test news 2", "id": "163974433696568_957850670975603" }]
            });
            let facebookClient = new FacebookClient(accessToken, appSecretProof);
            facebookClient.pageNavigationFeeds(navigationPageUrl).then(feeds => {
                assert.equal("test news 1", feeds.data[0].message);
                done();
            });
        });
    });
    
    describe("getProfiles", () => {
        let nodeErrorHandlerMock = null, sandbox = null;

        beforeEach("getProfiles", () => {
            sandbox = sinon.sandbox.create();
            nodeErrorHandlerMock = sandbox.mock(NodeErrorHandler).expects("noError");
        });

        afterEach("getProfiles", () => {
            sandbox.restore();
        });

        it("should fetch the friends list", (done) => {
            nodeErrorHandlerMock.returns(true);
            let url = `/v2.8/me/taggable_friends?fields=id,name,picture&limit=100&access_token=${accessToken}&appsecret_proof=${appSecretProof}`;
            nock("https://graph.facebook.com")
                .get(url)
                .reply(HttpResponseHandler.codes.OK, {
                    "data": [{
                        "id": "7dsEdsA8",
                        "name": "Maha Arjun",
                        "picture": {
                            "data": {
                                "is_silhouette": false,
                                "url": "https://scontent.xx.fbcdn.net/v/t1.0-1/c0.19.50.50/p50x50/14595563172_n.jpg"
                            }
                        }
                    },
                    { "id": "yrmFdKCsh1m",
                        "name": "Murali Krishna",
                        "picture": {
                            "data": {
                                "is_silhouette": false,
                                "url": "https://scontent.xx.fbcdn.net/v/t1.0-1/p50x50/14591830_n.jpg"
                            }
                        }
                    }]
                });

            let facebookClient = new FacebookClient(accessToken, appSecretProof);
            facebookClient.fetchProfiles().then((profiles) => {
                try {
                    expect(profiles.data).to.have.lengthOf(2);
                    expect(profiles.data[0].name).to.equal("Maha Arjun");
                    expect(profiles.data[1].name).to.equal("Murali Krishna");
                    done();
                } catch(error) {
                    done(error);
                }
            });
        });

        it("should reject the promise if there are any errors from facebook like authentication", (done) => {
            nodeErrorHandlerMock.returns(true);
            let url = `/v2.8/me/taggable_friends?fields=id,name,picture&limit=100&access_token=${accessToken}&appsecret_proof=${appSecretProof}`;

            nock("https://graph.facebook.com")
                .get(url)
                .reply(HttpResponseHandler.codes.BAD_REQUEST, {
                    "error": {
                        "message": "Error validating access token: Session has expired on Thursday, 10-Dec-15 04:00:00 PST. The current time is Thursday, 10-Dec-15 20:23:54 PST.",
                        "type": "OAuthException",
                        "code": 190,
                        "error_subcode": 463,
                        "fbtrace_id": "AWpk5h2ceG6"
                    }
                });

            let facebookClient = new FacebookClient(accessToken, appSecretProof);
            facebookClient.fetchProfiles().catch((error) => {
                try {
                    assert.strictEqual("OAuthException", error.type);
                    assert.strictEqual("Error validating access token: Session has expired on Thursday, 10-Dec-15 04:00:00 PST. The current time is Thursday, 10-Dec-15 20:23:54 PST.", error.message);
                    done();
                } catch(err) {
                    done(err);
                }
            });
        });
    });

    describe("getSourceUrls", () => {
        let facebookClient = null, keyword = "TheHindu", type = "page";

        beforeEach("getSourceUrls", () => {
            facebookClient = FacebookClient.instance(accessToken, appSecretProof);
        });

        it("should give an error when facebook is rejected with some error", (done) => {
            nock("https://graph.facebook.com")
                .get(`/v2.8/search?q=${keyword}&type=page&fields=id,name,picture&access_token=test_token&appsecret_proof=test_secret_proof`)
                .reply(HttpResponseHandler.codes.BAD_REQUEST, {
                    "error": { "message": "Invalid OAuth access token.",
                        "type": "OAuthException",
                        "code": 190
                    } }
                );

            facebookClient.fetchSourceUrls(keyword, type).catch(error => {
                try {
                    assert.strictEqual("OAuthException", error.type);
                    assert.strictEqual("Invalid OAuth access token.", error.message);
                    done();
                } catch(err) {
                    done(err);
                }
            });
        });

        it("should fetch the facebook pages", (done) => {
            let pages = { "data": [
                    { "name": "The Hindu", "id": "163974433696568" },
                    { "name": "The Hindu Business Line", "id": "60573550946" },
                    { "name": "The Hindu Temple of Canton", "id": "148163135208246" }] };

            nock("https://graph.facebook.com")
                .get(`/v2.8/search?q=${keyword}&type=page&fields=id,name,picture&access_token=test_token&appsecret_proof=test_secret_proof`)
                .reply(HttpResponseHandler.codes.OK, pages);

            facebookClient.fetchSourceUrls(keyword, type).then(data => {
                try {
                    expect(data).to.deep.equal(pages);
                    done();
                } catch(err) {
                    done(err);
                }
            });
        });

        it("should throw and error when given an invalid source type", (done) => {
            type = "something";
            facebookClient.fetchSourceUrls("keyword", type).catch(errorData => {
                try {
                    expect(errorData.error).to.eq(`Source type ${type} is not valid`);
                    done();
                } catch(err) {
                    done(err);
                }
            });
        });
    });
});
