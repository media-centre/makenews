/* eslint no-unused-expressions:0, max-nested-callbacks: [2, 5] */

"use strict";
import HttpResponseHandler from "../../../common/src/HttpResponseHandler.js";
import FacebookClient from "../../src/facebook/FacebookClient.js";
import NodeErrorHandler from "../../src/NodeErrorHandler.js";
import nock from "nock";
import { assert } from "chai";
import sinon from "sinon";

describe("FacebookClient", () => {

    describe("pageFeeds", () => {
        let accessToken = null, appSecretProof = null, pageName = null, remainingUrl = null;
        before("pageFeeds", () => {
            accessToken = "test_token";
            appSecretProof = "test_secret_proof";
            pageName = "thehindu";
            remainingUrl = "/v2.5/" + pageName + "/posts?fields=link,message,picture,name,caption,place,tags,privacy,created_time&access_token=" + accessToken + "&appsecret_proof=" + appSecretProof;
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
            facebookClient.pagePosts(pageName).then((feeds) => {
                assert.strictEqual("test news 1", feeds[0].message);
                assert.strictEqual("test news 2", feeds[1].message);
                nodErrorHandlerMock.verify();
                NodeErrorHandler.noError.restore();
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
            facebookClient.pagePosts(pageName).catch((error) => {
                assert.strictEqual("OAuthException", error.type);
                assert.strictEqual("Error validating access token: Session has expired on Thursday, 10-Dec-15 04:00:00 PST. The current time is Thursday, 10-Dec-15 20:23:54 PST.", error.message);
                nodErrorHandlerMock.verify();
                NodeErrorHandler.noError.restore();
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
            facebookClient.pagePosts(pageName).catch((error) => {
                assert.strictEqual("ETIMEDOUT", error.code);
                assert.strictEqual("ETIMEDOUT", error.errno);
                nodErrorHandlerMock.verify();
                NodeErrorHandler.noError.restore();
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
});
