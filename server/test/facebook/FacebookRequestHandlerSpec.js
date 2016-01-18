/* eslint no-unused-expressions:0, max-nested-callbacks: [2, 5] */

"use strict";
import FacebookClient from "../../src/facebook/FacebookClient.js";
import FacebookRequestHandler from "../../src/facebook/FacebookRequestHandler.js";
import CryptUtil from "../../src/util/CryptUtil.js";
import ApplicationConfig from "../../src/config/ApplicationConfig.js";
import LogTestHelper from "../helpers/LogTestHelper";
import AdminDbClient from "../../src/db/AdminDbClient";
import CouchClient from "../../src/CouchClient";
import { assert } from "chai";
import sinon from "sinon";

describe("FacebookRequestHandler", () => {
    let accessToken = null, appSecretKey = null, appSecretProof = null, appId = null;
    before("FacebookRequestHandler", () => {
        accessToken = "test_token";
        appSecretKey = "test_secret";
        appSecretProof = "test_secret_proof";
        appId = "test_app_id";
        sinon.stub(FacebookRequestHandler, "logger").returns(LogTestHelper.instance());
    });

    after("FacebookRequestHandler", () => {
        FacebookRequestHandler.logger.restore();
    });

    describe("constructor", () => {
        it("should throw error if the access token is empty", () => {
            let facebookRequestHandlerFunc = () => {
                return new FacebookRequestHandler(null);
            };
            assert.throw(facebookRequestHandlerFunc, Error, "access token can not be empty");
        });
    });

    describe("appSecretProof", () => {
        it("should get the encrypted access key for a facebook client access token and secret key", () => {
            let cryptUtilMock = sinon.mock(CryptUtil).expects("hmac");
            cryptUtilMock.withArgs("sha256", appSecretKey, "hex", accessToken);

            let facebookRequestHandler = new FacebookRequestHandler(accessToken);
            sinon.stub(facebookRequestHandler, "appSecretKey").returns(appSecretKey);
            facebookRequestHandler.appSecretProof();
            cryptUtilMock.verify();
            CryptUtil.hmac.restore();
        });
    });

    describe("appSecretKey", () => {
        it("should get the app secret key from the configuration file", () => {
            let applicationConfig = new ApplicationConfig();
            sinon.stub(ApplicationConfig, "instance").returns(applicationConfig);
            sinon.stub(applicationConfig, "facebook").returns({
                "appSecretKey": "test_secret_key"
            });
            let facebookRequestHandler = new FacebookRequestHandler(accessToken);
            let secretKey = facebookRequestHandler.appSecretKey();
            assert.strictEqual("test_secret_key", secretKey);
            ApplicationConfig.instance.restore();
            applicationConfig.facebook.restore();
        });

    });

    describe("appId", () => {
        it("should get the app Id from the configuration file", () => {
            let applicationConfig = new ApplicationConfig();
            sinon.stub(ApplicationConfig, "instance").returns(applicationConfig);
            sinon.stub(applicationConfig, "facebook").returns({
                "appId": "test_app_id"
            });
            let facebookRequestHandler = new FacebookRequestHandler(accessToken);
            assert.strictEqual("test_app_id", facebookRequestHandler.appId());
            ApplicationConfig.instance.restore();
            applicationConfig.facebook.restore();
        });

    });

    describe("pagePosts", () => {
        let facebookClientGetFacebookIdMock = null, facebookClient = null, facebookWebUrl = null, pageId = "12345", facebookRequestHandler = null, facebookClientPagePostsMock = null, feeds = null, requiredFields = null, optionsJson = null;
        beforeEach("pagePosts", () => {
            feeds = {
                "data": [{
                    "message": "Lammasingi village in #AndhraPradesh is a meteorological oddity. \n\nFind out how - bit.ly/1Y19P17",
                    "created_time": "2015-12-11T08:02:59+0000",
                    "id": "163974433696568_958425464251457"
                },
                {
                    "story": "The Hindu shared The Hindu Sports photo.",
                    "created_time": "2015-12-11T07:46:47+0000",
                    "id": "163974433696568_958422180918452"
                },
                {
                    "message": "#TamilNaduFloods: Packaged water is still in short supply in most of the flood-affected areas. As a result, residents have to either wait for two or three days or pay through the nose for it.",
                    "created_time": "2015-12-11T07:13:03+0000",
                    "id": "163974433696568_958414857585851"
                },
                {
                    "story": "The Hindu shared The Hindu Sports photo.",
                    "created_time": "2015-12-11T07:46:35+0000",
                    "id": "163974433696568_958422160918454"
                },
                {
                    "message": "Shah Rukh unseats Salman as India’s top-earning celebrity\nbit.ly/1RHWZjk",
                    "created_time": "2015-12-11T06:55:58+0000",
                    "id": "163974433696568_958408404253163"
                }]
            };
            facebookClient = new FacebookClient(accessToken, appSecretProof);
            sinon.stub(FacebookClient, "instance").withArgs(accessToken, appSecretProof).returns(facebookClient);
            facebookClientGetFacebookIdMock = sinon.mock(facebookClient).expects("getFacebookId");
            facebookClientPagePostsMock = sinon.mock(facebookClient).expects("pagePosts");
            facebookWebUrl = "https://www.facebook.com/TestPage";
            facebookRequestHandler = new FacebookRequestHandler(accessToken);
            sinon.stub(facebookRequestHandler, "appSecretProof").returns(appSecretProof);
            requiredFields = "link,message,picture,name,caption,place,tags,privacy,created_time";
            optionsJson = { "fields": requiredFields, "limit":100 }; //eslint-disable-line
        });

        afterEach("pagePosts", () => {
            FacebookClient.instance.restore();
            facebookClient.getFacebookId.restore();
            facebookClient.pagePosts.restore();
            facebookRequestHandler.appSecretProof.restore();
        });

        it("should return the page posts for a given facebook web url", (done) => {
            facebookClientGetFacebookIdMock.withArgs(facebookWebUrl).returns(Promise.resolve(pageId));
            facebookClientPagePostsMock.withArgs(pageId, optionsJson).returns(Promise.resolve(feeds));
            facebookRequestHandler.pagePosts(facebookWebUrl).then(actualFeeds => {
                assert.strictEqual(5, actualFeeds.length); //eslint-disable-line
                facebookClientGetFacebookIdMock.verify();
                facebookClientPagePostsMock.verify();
                done();
            });
        });

        it("should reject with error if there is error while fetching facebook id", (done) => {
            facebookClientGetFacebookIdMock.withArgs(facebookWebUrl).returns(Promise.reject("error"));
            facebookClientPagePostsMock.withArgs(pageId, optionsJson).never();
            facebookRequestHandler.pagePosts(facebookWebUrl).catch(error => {
                assert.deepEqual("error fetching facebook id of web url = https://www.facebook.com/TestPage", error);
                facebookClientGetFacebookIdMock.verify();
                facebookClientPagePostsMock.verify();
                done();
            });
        });

        it("should reject with error if there is error while fetching facebook feeds", (done) => {
            facebookClientGetFacebookIdMock.withArgs(facebookWebUrl).returns(Promise.resolve(pageId));
            facebookClientPagePostsMock.withArgs(pageId, optionsJson).returns(Promise.reject("error"));
            facebookRequestHandler.pagePosts(facebookWebUrl).catch(error => {
                assert.deepEqual("error fetching facebook feeds of web url = https://www.facebook.com/TestPage", error);
                facebookClientGetFacebookIdMock.verify();
                facebookClientPagePostsMock.verify();
                done();
            });
        });

    });

    describe("setToken", () => {
        let sandbox = null, facebookRequestHandler = null, facebookClientPagePostsMock = null, currentTime = 123486;

        beforeEach("setToken", () => {
            sandbox = sinon.sandbox.create();
            let facebookClient = new FacebookClient(accessToken, appSecretProof, appId);
            sandbox.stub(FacebookClient, "instance").withArgs(accessToken, appSecretProof, appId).returns(facebookClient);
            facebookClientPagePostsMock = sandbox.mock(facebookClient).expects("getLongLivedToken");
            facebookRequestHandler = new FacebookRequestHandler(accessToken);
            sandbox.stub(facebookRequestHandler, "appSecretKey").returns(appSecretProof);
            sandbox.stub(facebookRequestHandler, "appId").returns(appId);
            sandbox.stub(FacebookRequestHandler, "getCurrentTime").returns(currentTime);
        });

        afterEach("setToken", () => {
            sandbox.restore();
        });

        it("should create document for long lived token if there is no document", (done) => {
            const expiresIn = 12345;
            const tokenResponse = { "expires_in": expiresIn };
            facebookClientPagePostsMock.returns(Promise.resolve(tokenResponse));
            let couchClient = new CouchClient();
            let getDocStub = sinon.stub(couchClient, "getDocument");
            getDocStub.withArgs("facebookToken").returns(Promise.reject("error"));
            let saveDocStub = sinon.stub(couchClient, "saveDocument");
            saveDocStub.withArgs("facebookToken", tokenResponse).returns(Promise.resolve("save doc"));
            let adminDbMock = sandbox.mock(AdminDbClient).expects("instance").returns({ "getDb": ()=> {
                return Promise.resolve(couchClient);
            } });
            facebookRequestHandler.setToken().then(response => {
                assert.strictEqual(expiresIn + currentTime, response);
                facebookClientPagePostsMock.verify();
                adminDbMock.verify();
                assert(getDocStub.called);
                assert(saveDocStub.called);
                done();
            });
        });

        it("should update document for long lived token if document is there", (done) => {
            const expiresIn = 12345;
            const tokenResponse = { "access_token": "test1222",
                "token_type": "bearer",
                "expires_in": expiresIn };
            facebookClientPagePostsMock.returns(Promise.resolve(tokenResponse));
            let couchClient = new CouchClient();
            let getDocStub = sinon.stub(couchClient, "getDocument");
            getDocStub.withArgs("facebookToken").returns(Promise.resolve({ "_id": "facebookToken",
                "_rev": "1aa",
                "access_token": "test11",
                "token_type": "bearer",
                "expires_in": "123" }));
            let saveDocStub = sinon.stub(couchClient, "saveDocument");
            saveDocStub.withArgs("facebookToken", tokenResponse).returns(Promise.resolve("save doc"));

            let adminDbMock = sandbox.mock(AdminDbClient).expects("instance").returns({ "getDb": ()=> {
                return Promise.resolve(couchClient);
            } });
            facebookRequestHandler.setToken().then(response => {
                assert.strictEqual(expiresIn + currentTime, response);
                facebookClientPagePostsMock.verify();
                adminDbMock.verify();
                done();
            });
        });

        it("should throw error if long lived token not fetched", (done) => {
            facebookClientPagePostsMock.returns(Promise.reject("error"));
            facebookRequestHandler.setToken().catch(error => {
                assert.strictEqual(error, "error getting long lived token with token " + accessToken);
                facebookClientPagePostsMock.verify();
                done();
            });
        });
    });
});
