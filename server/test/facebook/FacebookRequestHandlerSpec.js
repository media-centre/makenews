
/* eslint no-unused-expressions:0, max-nested-callbacks: [2, 5] */

import FacebookClient from "../../src/facebook/FacebookClient";
import FacebookRequestHandler from "../../src/facebook/FacebookRequestHandler";
import CryptUtil from "../../src/util/CryptUtil";
import DateUtil from "../../src/util/DateUtil";
import ApplicationConfig from "../../src/config/ApplicationConfig";
import LogTestHelper from "../helpers/LogTestHelper";
import AdminDbClient from "../../src/db/AdminDbClient";
import CouchClient from "../../src/CouchClient";
import { assert, expect } from "chai";
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
            requiredFields = "link,message,picture,name,caption,place,privacy,created_time";
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
                assert.deepEqual("error fetching facebook feeds of web url = https://www.facebook.com/TestPage", error);
                facebookClientGetFacebookIdMock.verify();
                facebookClientPagePostsMock.verify();
                done();
            });
        });

        it("should reject with error if there is error while fetching facebook feeds", (done) => {
            facebookClientGetFacebookIdMock.withArgs(facebookWebUrl).returns(Promise.resolve(pageId));
            facebookClientPagePostsMock.withArgs(pageId, optionsJson).returns(Promise.reject("error"));
            facebookRequestHandler.pagePosts(facebookWebUrl).catch(error => {
                assert.strictEqual("error fetching facebook feeds of web url = https://www.facebook.com/TestPage", error);
                facebookClientGetFacebookIdMock.verify();
                facebookClientPagePostsMock.verify();
                done();
            });
        });

    });

    describe("setToken", () => {
        let sandbox = null, facebookRequestHandler = null, facebookClientPagePostsMock = null, currentTime = 123486, tokenDocId = "test_facebookToken", milliSeconds = 1000;

        beforeEach("setToken", () => {
            sandbox = sinon.sandbox.create();
            let facebookClient = new FacebookClient(accessToken, appSecretProof, appId);
            sandbox.stub(FacebookClient, "instance").withArgs(accessToken, appSecretProof, appId).returns(facebookClient);
            facebookClientPagePostsMock = sandbox.mock(facebookClient).expects("getLongLivedToken");
            facebookRequestHandler = new FacebookRequestHandler(accessToken);
            sandbox.stub(facebookRequestHandler, "appSecretKey").returns(appSecretProof);
            sandbox.stub(facebookRequestHandler, "appId").returns(appId);
            sandbox.stub(DateUtil, "getCurrentTime").returns(currentTime);
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
            getDocStub.withArgs(tokenDocId).returns(Promise.reject("error"));
            let saveDocStub = sinon.stub(couchClient, "saveDocument");
            saveDocStub.withArgs(tokenDocId, tokenResponse).returns(Promise.resolve("save doc"));
            let adminDbMock = sandbox.mock(AdminDbClient).expects("instance").returns(Promise.resolve(couchClient));
            facebookRequestHandler.setToken("test").then(response => {
                assert.strictEqual((expiresIn * milliSeconds) + currentTime, response);
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
            getDocStub.withArgs(tokenDocId).returns(Promise.resolve({ "_id": "facebookToken",
                "_rev": "1aa",
                "access_token": "test11",
                "token_type": "bearer",
                "expires_in": "123" }));
            let saveDocStub = sinon.stub(couchClient, "saveDocument");
            saveDocStub.withArgs(tokenDocId, tokenResponse).returns(Promise.resolve("save doc"));

            let adminDbMock = sandbox.mock(AdminDbClient).expects("instance").returns(Promise.resolve(couchClient));
            facebookRequestHandler.setToken("test").then(response => {
                assert.strictEqual((expiresIn * milliSeconds) + currentTime, response);
                facebookClientPagePostsMock.verify();
                adminDbMock.verify();
                done();
            });
        });

        it("should throw error if long lived token not fetched", (done) => {
            facebookClientPagePostsMock.returns(Promise.reject("error"));
            facebookRequestHandler.setToken("test").catch(error => {
                assert.strictEqual(error, "error getting long lived token with token " + accessToken);
                facebookClientPagePostsMock.verify();
                done();
            });
        });
    });
    
    describe("fetchProfiles", () => {
        let sandbox = null, facebookClient = null, facebookRequestHandler = null;
        beforeEach("", () => {
            sandbox = sinon.sandbox.create();
            facebookRequestHandler = new FacebookRequestHandler(accessToken);
            facebookClient = new FacebookClient(accessToken, appSecretProof);
            sandbox.mock(FacebookClient).expects("instance").returns(facebookClient);
        });

        afterEach("", () => {
            sandbox.restore();
        });

        it("should get the facebook profiles", (done) => {
            let profiles = { "data": [{
                "id": "7dsEdsA8",
                "name": "Maha Arjun",
                "picture": {
                    "data": {
                        "is_silhouette": false,
                        "url": "https://scontent.xx.fbcdn.net/v/t1.0-1/c0.19.50.50/p50x50/14595563172_n.jpg"
                    }
                }
            }] };

            sandbox.stub(facebookClient, "fetchProfiles").returns(Promise.resolve(profiles));

            facebookRequestHandler.fetchProfiles().then(profilesData => {
                try {
                    expect(profilesData).to.have.lengthOf(1); //eslint-disable-line no-magic-numbers
                    assert.strictEqual(profilesData, profiles.data);
                    done();
                } catch(error) {
                    done(error);
                }
            });
        });

        it("should reject when facebook client reject with an error", (done) => {
            sandbox.stub(facebookClient, "fetchProfiles").returns(Promise.reject("Error fetching Profiles"));

            facebookRequestHandler.fetchProfiles().catch(error => {
                try {
                    expect(error).to.equal("error fetching facebook profiles");
                    done();
                } catch(err) {
                    done(err);
                }
            });
        });
    });
    
    describe("Configured Sources", () => {
        let sandbox = null, dbName = null, body = null, facebookRequestHandler = null, couchClient = null;
        beforeEach("Configured Sources", () => {
            sandbox = sinon.sandbox.create();
            dbName = "db_name";
            body = { "selector": {
                "docType": {
                    "$eq": "configuredSource"
                }
            } };
            facebookRequestHandler = new FacebookRequestHandler("somethings");
            couchClient = new CouchClient(dbName, accessToken);
            sandbox.mock(CouchClient).expects("instance").returns(couchClient);
        });

        afterEach("Configured Sources", () => {
            sandbox.restore();
        });

        it("should get the facebook configured Sources", (done) => {
            let result = { "docs":
            [{ "_id": "7535677770c76f0bf6045a0e1401ccf4",
                "_rev": "1-23d11b676e21bca63e16d032a03b0826",
                "docType": "source",
                "sourceType": "fb-profile",
                "url": "http://www.facebook.com/profile1",
                "latestFeedTimestamp": "2016-11-21T01:57:48Z" },
                { "_id": "7535677770c76f0bf6045a0e1401ccf4",
                    "_rev": "1-23d11b676e21bca63e16d032a03b0826",
                    "docType": "source",
                    "sourceType": "fb-page",
                    "url": "http://www.facebook.com/profile1",
                    "latestFeedTimestamp": "2016-11-21T01:57:48Z" },
                { "_id": "7535677770c76f0bf6045a0e1401ccf4",
                    "_rev": "1-23d11b676e21bca63e16d032a03b0826",
                    "docType": "source",
                    "sourceType": "fb-group",
                    "url": "http://www.facebook.com/profile1",
                    "latestFeedTimestamp": "2016-11-21T01:57:48Z" },
                { "_id": "7535677770c76f0bf6045a0e1401ccf4",
                    "_rev": "1-23d11b676e21bca63e16d032a03b0826",
                    "docType": "source",
                    "sourceType": "twitter",
                    "url": "http://www.facebook.com/profile1",
                    "latestFeedTimestamp": "2016-11-21T01:57:48Z" },
                { "_id": "7535677770c76f0bf6045a0e1401ccf4",
                    "_rev": "1-23d11b676e21bca63e16d032a03b0826",
                    "docType": "source",
                    "sourceType": "web",
                    "url": "http://www.facebook.com/profile1",
                    "latestFeedTimestamp": "2016-11-21T01:57:48Z" }] };

            sandbox.stub(couchClient, "post").withArgs(`/${dbName}/_find`, body).returns(Promise.resolve(result));

            facebookRequestHandler.fetchConfiguredSources(dbName, accessToken).then(data => {
                try {
                    expect(data.profiles).to.deep.equal([result.docs[0]]); //eslint-disable-line no-magic-numbers
                    expect(data.pages).to.deep.equal([result.docs[1]]); //eslint-disable-line no-magic-numbers
                    expect(data.groups).to.deep.equal([result.docs[2]]); //eslint-disable-line no-magic-numbers
                    expect(data.twitter).to.deep.equal([result.docs[3]]); //eslint-disable-line no-magic-numbers
                    expect(data.web).to.deep.equal([result.docs[4]]); //eslint-disable-line no-magic-numbers
                    done();
                } catch (err) {
                    done(err);
                }
            });
        });

        it("should reject with error when database gives an error", (done) => {
            let errorMessage = "unexpected response from the db";
            sandbox.stub(couchClient, "post").returns(Promise.reject(errorMessage));
            facebookRequestHandler.fetchConfiguredSources(dbName, accessToken).catch(error => {
                try {
                    expect(error).to.equal(errorMessage);
                    done();
                } catch (err) {
                    done(err);
                }
            });
        });
    });

    describe("Add Configured Sources", () => {
        let sandbox = null, dbName = null, facebookRequestHandler = null, couchClient = null;
        let document = null, source = null, currentTime = 123456, sourceType = "fb-page";
        beforeEach("Add Configured Sources", () => {
            sandbox = sinon.sandbox.create();
            dbName = "db_name";
            source = {
                "name": "Source Name",
                "url": "http://source.url"
            };
            document = {
                "_id": source.url,
                "name": source.name,
                "docType": "configuredSource",
                "sourceType": sourceType,
                "latestFeedTimeStamp": currentTime
            };

            facebookRequestHandler = new FacebookRequestHandler("somethings");
            couchClient = new CouchClient(dbName, accessToken);
            sandbox.mock(CouchClient).expects("instance").returns(couchClient);
            sandbox.stub(DateUtil, "getCurrentTime").returns(currentTime);
        });

        afterEach("Add Configured Sources", () => {
            sandbox.restore();
        });

        it("should add the source to configured list", (done) => {
            let result = { "ok": true, "id": source.url, "rev": "1-5df5bc8192a245443f7d71842804c5c7" };

            sandbox.stub(couchClient, "saveDocument").withArgs(source.url, document).returns(Promise.resolve(result));

            facebookRequestHandler.addConfiguredSource(sourceType, source, dbName, accessToken).then(data => {
                try {
                    expect(data).to.deep.equal(result);
                    done();
                } catch (err) {
                    done(err);
                }
            });
        });

        it("should reject with error when database gives an error", (done) => {
            let errorMessage = "unexpected response from the db";
            sandbox.stub(couchClient, "saveDocument").returns(Promise.reject(errorMessage));
            facebookRequestHandler.addConfiguredSource(sourceType, source, dbName, accessToken).catch(error => {
                try {
                    expect(error).to.equal(errorMessage);
                    done();
                } catch (err) {
                    done(err);
                }
            });
        });
    });

    describe("fetchSourceUrls", () => {
        let sandbox = null, keyword = "TheHindu", type = "page", facebookRequstHandler = null;
        let facebookClientInstance = null;

        beforeEach("fetchSourceUrls", () => {
            sandbox = sinon.sandbox.create();
            facebookRequstHandler = new FacebookRequestHandler(accessToken);
            facebookClientInstance = new FacebookClient(accessToken, appSecretProof);
            sandbox.mock(FacebookClient).expects("instance").returns(facebookClientInstance);
        });

        afterEach("fetchSourceUrls", () => {
            sandbox.restore();
        });

        it("should throw an error when we got error from facebook client", (done) => {
            sandbox.stub(facebookClientInstance, "fetchSourceUrlsOf")
                .withArgs(keyword, type).returns(Promise.reject("Error fetching Pages"));
            facebookRequstHandler.fetchSourceUrlsOf(keyword, type).catch(error => {
                try {
                    expect(error).to.equal("error fetching facebook pages");
                    done();
                } catch(err) {
                    done(err);
                }
            });
        });

        it("should get facebook pages", (done) => {
            let pages = { "data": [
                { "name": "The Hindu", "id": "163974433696568" },
                { "name": "The Hindu Business Line", "id": "60573550946" },
                { "name": "The Hindu Temple of Canton", "id": "148163135208246" }] };

            sandbox.stub(facebookClientInstance, "fetchSourceUrlsOf")
                .withArgs(keyword, type).returns(Promise.resolve(pages));

            facebookRequstHandler.fetchSourceUrlsOf(keyword, type).then(pagesData => {
                try {
                    expect(pagesData.data).to.have.lengthOf(3); // eslint-disable-line no-magic-numbers
                    expect(pagesData).to.deep.equal(pages);
                    done();
                } catch(error) {
                    done(error);
                }
            });
        });
    });
});
