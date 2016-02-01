/*eslint max-nested-callbacks:0, brace-style:0, no-shadow:0*/
"use strict";
import TwitterLogin from "../../src/twitter/TwitterLogin.js";
import ApplicationConfig from "../../src/config/ApplicationConfig.js";
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

    it("should return instance with same oauthTokenSecret, serverCallbackUrl, clientCallbackUrl for a oauthToken", (done) => {
        let oauthMock = sandbox.mock(TwitterLogin).expects("createOAuthInstance").twice();
        let oauthToken = "token", oauthTokenSecret = "secret", serverCallbackUrl = "serverUrl", clientCallbackUrl = "clientUrl";
        oauthMock.returns({ "getOAuthRequestToken": ({ "oauth_callback": serverCallbackUrl }, callback) => { callback(null, oauthToken, oauthTokenSecret); } });
        let twitterLogin1 = TwitterLogin.instance({ "serverCallbackUrl": serverCallbackUrl, "clientCallbackUrl": clientCallbackUrl });
        twitterLogin1.then(() => {
            //second request
            let twitterLogin2 = TwitterLogin.instance({ "previouslyFetchedOauthToken": oauthToken });
            twitterLogin2.then(twitterInstance => {
                assert.strictEqual(twitterInstance.oauthTokenSecret, oauthTokenSecret);
                assert.strictEqual(twitterInstance.clientCallbackUrl, clientCallbackUrl);
                done();
            });
        });
    });

    describe("accessTokenFromTwitter", () => {
        it("should get the access_token from twitter", (done) => {
            let oauthMock = sandbox.mock(TwitterLogin).expects("createOAuthInstance").twice();
            let oauthToken = "token", oauthTokenSecret = "secret", serverCallbackUrl = "serverUrl", clientCallbackUrl = "clientUrl";
            let oauthVerifier = "oauth_verifier", oauthAccessToken = "oauthAccessToken", oauthAccessTokenSecret = "oauthAccessTokenSecret";
            oauthMock.returns(
                {
                    "getOAuthRequestToken": ({ "oauth_callback": serverCallbackUrl }, callback) => { callback(null, oauthToken, oauthTokenSecret); },
                    "getOAuthAccessToken": (authToken, oauthTokenSecret, oauthVerifier, callback) => { callback(null, oauthAccessToken, oauthAccessTokenSecret, []); }
                });

            TwitterLogin.instance({ "serverCallbackUrl": serverCallbackUrl, "clientCallbackUrl": clientCallbackUrl }).then((firstInstance) => {
                let twitterLoginPromise = TwitterLogin.instance({ "previouslyFetchedOauthToken": firstInstance.oauthToken });
                twitterLoginPromise.then((instance) => {
                    instance.accessTokenFromTwitter(oauthVerifier).then((clientRedirectUrl) => { //eslint-disable-line  no-unused-vars
                        done();
                    });
                });
            });
        });
    });
});
