/*eslint max-nested-callbacks:0, brace-style:0, no-shadow:0*/

import TwitterLogin from "../../src/twitter/TwitterLogin";
import ApplicationConfig from "../../src/config/ApplicationConfig";
import CouchClient from "../../src/CouchClient";
import AdminDbClient from "../../src/db/AdminDbClient";
import LogTestHelper from "../helpers/LogTestHelper";
import { userDetails } from "./../../src/Factory";
import { assert } from "chai";
import sinon from "sinon";

describe("TwitterLogin", () => {
    let sandbox = null;
    beforeEach("TwitterLogin", () => {
        sandbox = sinon.sandbox.create();
        sandbox.stub(TwitterLogin, "logger").returns(LogTestHelper.instance());
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
        oauthMock.returns({ "getOAuthRequestToken": (options, callback) => { callback(null, oauthToken, oauthTokenSecret); } });
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
        it("should get the access_token from twitter and update twitterDoc for user", async() => {
            let oauthMock = sandbox.mock(TwitterLogin).expects("createOAuthInstance").twice();
            let oauthToken = "token", oauthTokenSecret = "secret", serverCallbackUrl = "serverUrl", clientCallbackUrl = "clientUrl", authSession = "test_token";
            let oauthVerifier = "oauth_verifier", oauthAccessToken = "oauthAccessToken", oauthAccessTokenSecret = "oauthAccessTokenSecret", twitterDocId = "userName_twitterToken";
            oauthMock.returns(
                {
                    "getOAuthRequestToken": (options, callback) => { callback(null, oauthToken, oauthTokenSecret); },
                    "getOAuthAccessToken": (authToken, oauthTokenSecret, oauthVerifier, callback) => { callback(null, oauthAccessToken, oauthAccessTokenSecret, []); }
                });
            let couchClient = new CouchClient("access_token");
            let getDocStub = sinon.stub(couchClient, "getDocument");
            getDocStub.withArgs(twitterDocId).returns(Promise.resolve({
                "oauthAccessToken": "oldAccessToken",
                "oauthAccessTokenSecret": "oldSecret"
            }));
            let userName = "userName";
            let userDetailsMock = sandbox.mock(userDetails).expects("getUser");
            userDetailsMock.withArgs(authSession).returns({ userName });
            let saveDocStub = sinon.mock(couchClient).expects("saveDocument");
            saveDocStub.withArgs(twitterDocId, { "oauthAccessToken": oauthAccessToken, "oauthAccessTokenSecret": oauthAccessTokenSecret }).returns(Promise.resolve());
            let adminDbMock = sandbox.mock(AdminDbClient).expects("instance").returns(Promise.resolve(couchClient));

            let firstInstance = await TwitterLogin.instance({ "serverCallbackUrl": serverCallbackUrl, "clientCallbackUrl": clientCallbackUrl });
            let twitterLoginPromise = await TwitterLogin.instance({ "previouslyFetchedOauthToken": firstInstance.oauthToken, "accessToken": authSession });
            let instance = await twitterLoginPromise;
            let clientRedirectUrl = await instance.accessTokenFromTwitter(oauthVerifier);
            assert.strictEqual(clientRedirectUrl, clientCallbackUrl);
            saveDocStub.verify();
            adminDbMock.verify();
        });

        it("should get the access_token from twitter and create twitterDoc for user", async() => {
            let oauthMock = sandbox.mock(TwitterLogin).expects("createOAuthInstance").twice();
            let oauthToken = "token", oauthTokenSecret = "secret", serverCallbackUrl = "serverUrl", clientCallbackUrl = "clientUrl";
            let authSession = "test_token";
            let oauthVerifier = "oauth_verifier", oauthAccessToken = "oauthAccessToken", oauthAccessTokenSecret = "oauthAccessTokenSecret", twitterDocId = "userName_twitterToken";
            oauthMock.returns(
                {
                    "getOAuthRequestToken": (options, callback) => {
                        callback(null, oauthToken, oauthTokenSecret);
                    },
                    "getOAuthAccessToken": (authToken, oauthTokenSecret, oauthVerifier, callback) => {
                        callback(null, oauthAccessToken, oauthAccessTokenSecret, []);
                    }
                });
            let couchClient = new CouchClient();
            let getDocStub = sinon.stub(couchClient, "getDocument");
            getDocStub.withArgs(twitterDocId).returns(Promise.reject());
            let saveDocStub = sinon.mock(couchClient).expects("saveDocument");
            let userName = "userName";
            let userDetailsMock = sandbox.mock(userDetails).expects("getUser");
            userDetailsMock.withArgs(authSession).returns({ userName });
            saveDocStub.withArgs(twitterDocId, {
                "oauthAccessToken": oauthAccessToken,
                "oauthAccessTokenSecret": oauthAccessTokenSecret
            }).returns(Promise.resolve());
            let adminDbMock = sandbox.mock(AdminDbClient).expects("instance").returns(Promise.resolve(couchClient));

            let firstInstance = await TwitterLogin.instance({
                "serverCallbackUrl": serverCallbackUrl,
                "clientCallbackUrl": clientCallbackUrl
            });
            let twitterLoginPromise = TwitterLogin.instance({
                "previouslyFetchedOauthToken": firstInstance.oauthToken,
                "accessToken": "test_token"
            });
            let instance = await twitterLoginPromise;
            let clientRedirectUrl = await instance.accessTokenFromTwitter(oauthVerifier);
            assert.strictEqual(clientRedirectUrl, clientCallbackUrl);
            saveDocStub.verify();
            adminDbMock.verify();
        });
    });
});
