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
        const oauthMock = sandbox.mock(TwitterLogin).expects("createOAuthInstance").twice();
        const oauthToken = "token";
        const oauthTokenSecret = "secret";
        const serverCallbackUrl = "serverUrl";
        const clientCallbackUrl = "clientUrl";
        oauthMock.returns({ "getOAuthRequestToken": (options, callback) => { callback(null, oauthToken, oauthTokenSecret); } });
        const twitterLogin1 = TwitterLogin.instance({ "serverCallbackUrl": serverCallbackUrl, "clientCallbackUrl": clientCallbackUrl });
        twitterLogin1.then(() => {
            //second request
            const twitterLogin2 = TwitterLogin.instance({ "previouslyFetchedOauthToken": oauthToken });
            twitterLogin2.then(twitterInstance => {
                assert.strictEqual(twitterInstance.oauthTokenSecret, oauthTokenSecret);
                assert.strictEqual(twitterInstance.clientCallbackUrl, clientCallbackUrl);
                done();
            });
        });
    });

    describe("accessTokenFromTwitter", () => {
        it("should get the access_token from twitter and update twitterDoc for user", async() => {
            const oauthMock = sandbox.mock(TwitterLogin).expects("createOAuthInstance").twice();
            const oauthToken = "token";
            const oauthTokenSecret = "secret";
            const serverCallbackUrl = "serverUrl";
            const clientCallbackUrl = "clientUrl";
            const authSession = "test_token";
            const oauthVerifier = "oauth_verifier";
            const oauthAccessToken = "oauthAccessToken";
            const oauthAccessTokenSecret = "oauthAccessTokenSecret";
            const twitterDocId = "userName_twitterToken";
            oauthMock.returns(
                {
                    "getOAuthRequestToken": (options, callback) => { callback(null, oauthToken, oauthTokenSecret); },
                    "getOAuthAccessToken": (authToken, oauthTokenSecret, oauthVerifier, callback) => { callback(null, oauthAccessToken, oauthAccessTokenSecret, []); }
                });
            const couchClient = new CouchClient("access_token");
            const getDocStub = sinon.stub(couchClient, "getDocument");
            getDocStub.withArgs(twitterDocId).returns(Promise.resolve({
                "oauthAccessToken": "oldAccessToken",
                "oauthAccessTokenSecret": "oldSecret"
            }));
            const userName = "userName";
            const userDetailsMock = sandbox.mock(userDetails).expects("getUser");
            userDetailsMock.withArgs(authSession).returns({ userName });
            const saveDocStub = sinon.mock(couchClient).expects("saveDocument");
            saveDocStub.withArgs(twitterDocId, { "oauthAccessToken": oauthAccessToken, "oauthAccessTokenSecret": oauthAccessTokenSecret }).returns(Promise.resolve());
            const adminDbMock = sandbox.mock(AdminDbClient).expects("instance").returns(Promise.resolve(couchClient));

            const firstInstance = await TwitterLogin.instance({ "serverCallbackUrl": serverCallbackUrl, "clientCallbackUrl": clientCallbackUrl });
            const twitterLoginPromise = await TwitterLogin.instance({ "previouslyFetchedOauthToken": firstInstance.oauthToken, "accessToken": authSession });
            const instance = await twitterLoginPromise;
            const clientRedirectUrl = await instance.accessTokenFromTwitter(oauthVerifier);
            assert.strictEqual(clientRedirectUrl, clientCallbackUrl);
            saveDocStub.verify();
            adminDbMock.verify();
        });

        it("should get the access_token from twitter and create twitterDoc for user", async() => {
            const oauthMock = sandbox.mock(TwitterLogin).expects("createOAuthInstance").twice();
            const oauthToken = "token";
            const oauthTokenSecret = "secret";
            const serverCallbackUrl = "serverUrl";
            const clientCallbackUrl = "clientUrl";
            const authSession = "test_token";
            const oauthVerifier = "oauth_verifier";
            const oauthAccessToken = "oauthAccessToken";
            const oauthAccessTokenSecret = "oauthAccessTokenSecret";
            const twitterDocId = "userName_twitterToken";
            oauthMock.returns(
                {
                    "getOAuthRequestToken": (options, callback) => {
                        callback(null, oauthToken, oauthTokenSecret);
                    },
                    "getOAuthAccessToken": (authToken, oauthTokenSecret, oauthVerifier, callback) => {
                        callback(null, oauthAccessToken, oauthAccessTokenSecret, []);
                    }
                });
            const couchClient = new CouchClient();
            const getDocStub = sinon.stub(couchClient, "getDocument");
            getDocStub.withArgs(twitterDocId).returns(Promise.reject());
            const saveDocStub = sinon.mock(couchClient).expects("saveDocument");
            const userName = "userName";
            const userDetailsMock = sandbox.mock(userDetails).expects("getUser");
            userDetailsMock.withArgs(authSession).returns({ userName });
            saveDocStub.withArgs(twitterDocId, {
                "oauthAccessToken": oauthAccessToken,
                "oauthAccessTokenSecret": oauthAccessTokenSecret
            }).returns(Promise.resolve());
            const adminDbMock = sandbox.mock(AdminDbClient).expects("instance").returns(Promise.resolve(couchClient));

            const firstInstance = await TwitterLogin.instance({
                "serverCallbackUrl": serverCallbackUrl,
                "clientCallbackUrl": clientCallbackUrl
            });
            const twitterLoginPromise = TwitterLogin.instance({
                "previouslyFetchedOauthToken": firstInstance.oauthToken,
                "accessToken": "test_token"
            });
            const instance = await twitterLoginPromise;
            const clientRedirectUrl = await instance.accessTokenFromTwitter(oauthVerifier);
            assert.strictEqual(clientRedirectUrl, clientCallbackUrl);
            saveDocStub.verify();
            adminDbMock.verify();
        });
    });
});
