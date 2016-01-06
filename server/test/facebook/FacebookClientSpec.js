/* eslint no-unused-expressions:0, max-nested-callbacks: [2, 5], no-magic-numbers:0 */

"use strict";
import HttpResponseHandler from "../../../common/src/HttpResponseHandler.js";
import FacebookClient from "../../src/facebook/FacebookClient.js";
import NodeErrorHandler from "../../src/NodeErrorHandler.js";
import ApplicationConfig from "../../src/config/ApplicationConfig.js";
import nock from "nock";
import { assert } from "chai";
import sinon from "sinon";

describe("FacebookClient", () => {
    let applicationConfigFacebookStub = null, applicationConfig = null;
    before("FacebookClient", () => {
        applicationConfig = new ApplicationConfig();
        sinon.stub(ApplicationConfig, "instance").returns(applicationConfig);
        applicationConfigFacebookStub = sinon.stub(applicationConfig, "facebook");
        applicationConfigFacebookStub.returns({
            "url": "https://graph.facebook.com/v2.5",
            "appSecretKey": "appSecretKey",
            "timeOutInSeconds": 10
        });
    });

    after("FacebookClient", () => {
        ApplicationConfig.instance.restore();
        applicationConfig.facebook.restore();
    });

    describe("pageFeeds", () => {
        let accessToken = null, appSecretProof = null, facebookUrl = null, remainingUrl = null;
        before("pageFeeds", () => {
            accessToken = "test_token";
            appSecretProof = "test_secret_proof";
            facebookUrl = "http://www.facebook.com/thehindu";
            remainingUrl = "/v2.5/12345678/posts?fields=link,message,picture,name,caption,place,tags,privacy,created_time&access_token=" + accessToken + "&appsecret_proof=" + appSecretProof;
        });

        it("should return feeds for a public page", (done) => {
            let nodErrorHandlerMock = sinon.mock(NodeErrorHandler).expects("noError");
            nodErrorHandlerMock.returns(true);

            nock("https://graph.facebook.com")
                .get(remainingUrl)
                .reply(HttpResponseHandler.codes.OK, {
                    "data":
                        [{ "message": "test news 1", "id": "163974433696568_957858557641481" },
                            { "message": "test news 2", "id": "163974433696568_957850670975603" }]
                });
            let facebookClient = new FacebookClient(accessToken, appSecretProof);
            let facebookClientGetFacebookIdStub = sinon.stub(facebookClient, "getFacebookId");
            facebookClientGetFacebookIdStub.withArgs(facebookUrl).returns(Promise.resolve("12345678"));
            facebookClient.pagePosts(facebookUrl).then((feeds) => {
                assert.strictEqual("test news 1", feeds[0].message);
                assert.strictEqual("test news 2", feeds[1].message);
                nodErrorHandlerMock.verify();
                NodeErrorHandler.noError.restore();
                facebookClient.getFacebookId.restore();
                done();
            });
        });

        it("should reject the promise if there are any errors from facebook like authentication", (done) => {
            let nodErrorHandlerMock = sinon.mock(NodeErrorHandler).expects("noError");
            nodErrorHandlerMock.returns(true);

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
            let facebookClientGetFacebookIdStub = sinon.stub(facebookClient, "getFacebookId");
            facebookClientGetFacebookIdStub.withArgs(facebookUrl).returns(Promise.resolve("12345678"));
            facebookClient.pagePosts(facebookUrl).catch((error) => {
                assert.strictEqual("OAuthException", error.type);
                assert.strictEqual("Error validating access token: Session has expired on Thursday, 10-Dec-15 04:00:00 PST. The current time is Thursday, 10-Dec-15 20:23:54 PST.", error.message);
                nodErrorHandlerMock.verify();
                NodeErrorHandler.noError.restore();
                facebookClient.getFacebookId.restore();
                done();
            });
        });

        it("should reject with error if the facebook node is not available", (done) => {
            let nodErrorHandlerMock = sinon.mock(NodeErrorHandler).expects("noError");
            nodErrorHandlerMock.returns(false);

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
            let facebookClientGetFacebookIdStub = sinon.stub(facebookClient, "getFacebookId");
            facebookClientGetFacebookIdStub.withArgs(facebookUrl).returns(Promise.resolve("12345678"));
            facebookClient.pagePosts(facebookUrl).catch((error) => {
                assert.strictEqual("ETIMEDOUT", error.code);
                assert.strictEqual("ETIMEDOUT", error.errno);
                nodErrorHandlerMock.verify();
                NodeErrorHandler.noError.restore();
                facebookClient.getFacebookId.restore();
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
            let facebookClientGetFacebookIdStub = sinon.stub(facebookClient, "getFacebookId");
            facebookClientGetFacebookIdStub.withArgs(facebookUrl).returns(Promise.resolve("12345678"));
            facebookClient.pagePosts(facebookUrl).catch((error) => { //eslint-disable-line
                facebookClient.getFacebookId.restore();
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
                assert.strictEqual("page name cannot be empty", error.message);
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
            remainingUrl = "/v2.5/" + facebookUrl1 + "/?access_token=" + accessToken1 + "&appsecret_proof=" + appSecretProof1;
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
});
