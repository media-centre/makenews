/*eslint max-nested-callbacks:0, brace-style:0, no-shadow:0*/
"use strict";
import TwitterLogin from "../../src/twitter/TwitterLogin.js";
import ApplicationConfig from "../../src/config/ApplicationConfig.js";
import CouchClient from "../../src/CouchClient";
import AdminDbClient from "../../src/db/AdminDbClient";
import { assert } from "chai";
import sinon from "sinon";

describe("TwitterLogin", () => {
    let sandbox = null;
    beforeEach("TwitterLogin", () => {
        sandbox = sinon.sandbox.create();
    });
    afterEach("TwitterLogin", () => {
        sandbox.restore();
    });


    it("should initialise oauth with app consumer_key and consumer_secret", () => {
        TwitterLogin.instance().then((twitterLogin) => {
            assert.isDefined(twitterLogin.oauth, "oauth has been defined");
            assert.strictEqual(twitterLogin.oauth._consumerKey, ApplicationConfig.instance().twitter().consumerKey);
            assert.strictEqual(twitterLogin.oauth._consumerSecret, ApplicationConfig.instance().twitter().consumerSecret);

        });
    });

    it("should return instance with same oauthTokenSecret, serverCallbackUrl, clientCallbackUrl, userName for a oauthToken", (done) => {
        let oauthMock = sandbox.mock(TwitterLogin).expects("createOAuthInstance").twice();
        let oauthToken = "token", oauthTokenSecret = "secret", serverCallbackUrl = "serverUrl", clientCallbackUrl = "clientUrl", userName = "Maharjun";
        oauthMock.returns({ "getOAuthRequestToken": ({ "oauth_callback": serverCallbackUrl }, callback) => { callback(null, oauthToken, oauthTokenSecret); } });
        let twitterLogin1 = TwitterLogin.instance({ "serverCallbackUrl": serverCallbackUrl, "clientCallbackUrl": clientCallbackUrl, "userName": userName });
        twitterLogin1.then(() => {
            //second request
            let twitterLogin2 = TwitterLogin.instance({ "previouslyFetchedOauthToken": oauthToken });
            twitterLogin2.then(twitterInstance => {
                assert.strictEqual(twitterInstance.oauthTokenSecret, oauthTokenSecret);
                assert.strictEqual(twitterInstance.clientCallbackUrl, clientCallbackUrl);
                assert.strictEqual(twitterInstance.userName, userName);
                done();
            });
        });
    });

    describe("accessTokenFromTwitter", () => {
        it("should get the access_token from twitter and update twitterDoc for user", (done) => {
            let oauthMock = sandbox.mock(TwitterLogin).expects("createOAuthInstance").twice();
            let oauthToken = "token", oauthTokenSecret = "secret", serverCallbackUrl = "serverUrl", clientCallbackUrl = "clientUrl";
            let oauthVerifier = "oauth_verifier", oauthAccessToken = "oauthAccessToken", oauthAccessTokenSecret = "oauthAccessTokenSecret", twitterDocId = "userName_twitterToken";
            oauthMock.returns(
                {
                    "getOAuthRequestToken": ({ "oauth_callback": serverCallbackUrl }, callback) => { callback(null, oauthToken, oauthTokenSecret); },
                    "getOAuthAccessToken": (authToken, oauthTokenSecret, oauthVerifier, callback) => { callback(null, oauthAccessToken, oauthAccessTokenSecret, []); }
                });
            let couchClient = new CouchClient();
            let getDocStub = sinon.stub(couchClient, "getDocument");
            getDocStub.withArgs(twitterDocId).returns(Promise.resolve({
                "oauthAccessToken": "oldAccessToken",
                "oauthAccessTokenSecret": "oldSecret"
            }));
            let saveDocStub = sinon.mock(couchClient).expects("saveDocument");
            saveDocStub.withArgs(twitterDocId, { "oauthAccessToken": oauthAccessToken, "oauthAccessTokenSecret": oauthAccessTokenSecret }).returns(Promise.resolve());
            let adminDbMock = sandbox.mock(AdminDbClient).expects("instance").returns({ "getDb": () => {
                return Promise.resolve(couchClient);
            } });

            TwitterLogin.instance({ "serverCallbackUrl": serverCallbackUrl, "clientCallbackUrl": clientCallbackUrl, "userName": "userName" }).then((firstInstance) => {
                let twitterLoginPromise = TwitterLogin.instance({ "previouslyFetchedOauthToken": firstInstance.oauthToken });
                twitterLoginPromise.then((instance) => {
                    instance.accessTokenFromTwitter(oauthVerifier).then((clientRedirectUrl) => {
                        assert.strictEqual(clientRedirectUrl, clientCallbackUrl);
                        saveDocStub.verify();
                        adminDbMock.verify();
                        done();
                    });
                });
            });
        });

        it("should get the access_token from twitter and create twitterDoc for user", (done) => {
            let oauthMock = sandbox.mock(TwitterLogin).expects("createOAuthInstance").twice();
            let oauthToken = "token", oauthTokenSecret = "secret", serverCallbackUrl = "serverUrl", clientCallbackUrl = "clientUrl";
            let oauthVerifier = "oauth_verifier", oauthAccessToken = "oauthAccessToken", oauthAccessTokenSecret = "oauthAccessTokenSecret", twitterDocId = "userName_twitterToken";
            oauthMock.returns(
                {
                    "getOAuthRequestToken": ({ "oauth_callback": serverCallbackUrl }, callback) => { callback(null, oauthToken, oauthTokenSecret); },
                    "getOAuthAccessToken": (authToken, oauthTokenSecret, oauthVerifier, callback) => { callback(null, oauthAccessToken, oauthAccessTokenSecret, []); }
                });
            let couchClient = new CouchClient();
            let getDocStub = sinon.stub(couchClient, "getDocument");
            getDocStub.withArgs(twitterDocId).returns(Promise.reject());
            let saveDocStub = sinon.mock(couchClient).expects("saveDocument");
            saveDocStub.withArgs(twitterDocId, { "oauthAccessToken": oauthAccessToken, "oauthAccessTokenSecret": oauthAccessTokenSecret }).returns(Promise.resolve());
            let adminDbMock = sandbox.mock(AdminDbClient).expects("instance").returns({ "getDb": () => {
                return Promise.resolve(couchClient);
            } });

            TwitterLogin.instance({ "serverCallbackUrl": serverCallbackUrl, "clientCallbackUrl": clientCallbackUrl, "userName": "userName" }).then((firstInstance) => {
                let twitterLoginPromise = TwitterLogin.instance({ "previouslyFetchedOauthToken": firstInstance.oauthToken });
                twitterLoginPromise.then((instance) => {
                    instance.accessTokenFromTwitter(oauthVerifier).then((clientRedirectUrl) => {
                        assert.strictEqual(clientRedirectUrl, clientCallbackUrl);
                        saveDocStub.verify();
                        adminDbMock.verify();
                        done();
                    });
                });
            });
        });
    });
});
