/* eslint no-unused-expressions:0, max-nested-callbacks: [2, 5] */
import FacebookClient from "../../src/facebook/FacebookClient";
import FacebookRequestHandler from "../../src/facebook/FacebookRequestHandler";
import CryptUtil from "../../src/util/CryptUtil";
import DateUtil from "../../src/util/DateUtil";
import ApplicationConfig from "../../src/config/ApplicationConfig";
import LogTestHelper from "../helpers/LogTestHelper";
import AdminDbClient from "../../src/db/AdminDbClient";
import CouchClient from "../../src/CouchClient";
import { userDetails } from "../../src/Factory";
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

    describe("CouchClient", () => {
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

    describe("fetchFeeds", () => {
        let facebookClient = null, sourceId = null, facebookRequestHandler = null;
        let facebookClientPagePostsMock = null, feeds = null, requiredFields = null;
        let optionsJson = null;
        beforeEach("fetchFeeds", () => {
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
            facebookClientPagePostsMock = sinon.mock(facebookClient).expects("fetchFeeds");
            sourceId = "https://www.facebook.com/TestPage";
            facebookRequestHandler = new FacebookRequestHandler(accessToken);
            sinon.stub(facebookRequestHandler, "appSecretProof").returns(appSecretProof);
            requiredFields = "link,message,picture,name,caption,place,privacy,created_time";
            optionsJson = {"fields": requiredFields, "limit": 100}; //eslint-disable-line
        });

        afterEach("fetchFeeds", () => {
            FacebookClient.instance.restore();
            facebookClient.fetchFeeds.restore();
            facebookRequestHandler.appSecretProof.restore();
        });

        it("should return the page posts for a given facebook web url", (done) => {
            facebookClientPagePostsMock.withArgs(sourceId, "posts", optionsJson).returns(Promise.resolve(feeds));
            facebookRequestHandler.fetchFeeds(sourceId, "posts").then(actualFeeds => {
                assert.strictEqual(5, actualFeeds.data.length); //eslint-disable-line
                facebookClientPagePostsMock.verify();
                done();
            });
        });

        it("should reject with error if there is error while fetching facebook id", (done) => {
            facebookClientPagePostsMock.withArgs(sourceId, "posts", optionsJson).never();
            facebookRequestHandler.fetchFeeds(sourceId, "posts").catch(error => {
                assert.deepEqual("error fetching facebook feeds of web url = https://www.facebook.com/TestPage", error);
                facebookClientPagePostsMock.verify();
                done();
            });
        });

        it("should reject with error if there is error while fetching facebook feeds", (done) => {
            facebookClientPagePostsMock.withExactArgs(sourceId, "posts", optionsJson).returns(Promise.reject("error"));
            facebookRequestHandler.fetchFeeds(sourceId, "posts").catch(error => {
                assert.strictEqual("error fetching facebook feeds of web url = https://www.facebook.com/TestPage", error);
                facebookClientPagePostsMock.verify();
                done();
            });
        });

    });

    describe("setToken", () => {
        let sandbox = null, facebookRequestHandler = null, facebookClientPagePostsMock = null, currentTime = 123486, milliSeconds = 1000;

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

        it("should create document for long lived token if there is no document", async() => {
            const expiresIn = 12345, expiredAfter = 12468486;
            const tokenResponse = { "expires_in": expiresIn };
            facebookClientPagePostsMock.returns(Promise.resolve(tokenResponse));
            let adminDbClient = new AdminDbClient();
            sandbox.mock(AdminDbClient).expects("instance").returns(Promise.resolve(adminDbClient));
            sandbox.mock(userDetails).expects("getUser").returns({ "userName": "userName" });
            sandbox.mock(adminDbClient).expects("getDocument").returns(Promise.reject("error occured while getting the document"));
            sandbox.mock(facebookRequestHandler).expects("saveToken").returns(Promise.resolve(expiredAfter));
            try {
                let response = await facebookRequestHandler.setToken("test");
                assert.equal(response, currentTime + (tokenResponse.expires_in * milliSeconds));
            } catch (error) {
                assert.fail(error);
            }
        });

        it("should update document for long lived token if document is there", async() => {
            const expiresIn = 12345;
            let document = {
                "access_token": "accessToken",
                "token_type": "tokenType",
                "expires_in": expiresIn,
                "expired_after": 345
            };
            let tokenResponse = {
                "access_token": "accessToken",
                "token_type": "tokenType",
                "expires_in": expiresIn,
                "expired_after": 345
            };
            facebookClientPagePostsMock.returns(Promise.resolve(tokenResponse));
            let expiredAfter = 345;
            let couchClient = new CouchClient();
            let adminDbClient = new AdminDbClient();
            sandbox.mock(AdminDbClient).expects("instance").returns(Promise.resolve(adminDbClient));
            sandbox.mock(CouchClient).expects("instance").returns(couchClient);
            sandbox.mock(adminDbClient).expects("getDocument").returns(Promise.resolve(document));
            sandbox.mock(facebookRequestHandler).expects("saveToken").returns(Promise.resolve(expiredAfter));
            sandbox.mock(userDetails).expects("getUser").withArgs("test").returns({ "userName": "userName" });
            try {
                let response = await facebookRequestHandler.setToken("test");
                assert.equal(response, expiredAfter);
            } catch (error) {
                assert.fail(error);
            }
        });

        it("should throw error if long lived token not fetched", async () => {
            facebookClientPagePostsMock.returns(Promise.reject("error"));
            try {
                await facebookRequestHandler.setToken("test");
                assert.fail();
            } catch(error) {
                assert.deepEqual(error, new Error("error getting long lived token with token " + accessToken));
            }
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
            let profiles = {
                "data": [{
                    "id": "7dsEdsA8",
                    "name": "Maha Arjun",
                    "picture": {
                        "data": {
                            "is_silhouette": false,
                            "url": "https://scontent.xx.fbcdn.net/v/t1.0-1/c0.19.50.50/p50x50/14595563172_n.jpg"
                        }
                    }
                }]
            };

            sandbox.stub(facebookClient, "fetchProfiles").returns(Promise.resolve(profiles));

            facebookRequestHandler.fetchProfiles().then(profilesData => {
                try {
                    expect(profilesData).to.have.lengthOf(1); //eslint-disable-line no-magic-numbers
                    assert.strictEqual(profilesData, profiles.data);
                    done();
                } catch (error) {
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
            sandbox.stub(facebookClientInstance, "fetchSourceUrls")
                .returns(Promise.reject("Error fetching Pages"));
            facebookRequstHandler.fetchSourceUrls({ "type": "page" }).catch(error => {
                try {
                    expect(error).to.equal("error fetching facebook pages");
                    done();
                } catch (err) {
                    done(err);
                }
            });
        });

        it("should get facebook pages", (done) => {
            let pages = {
                "data": [
                    { "name": "The Hindu", "id": "163974433696568" },
                    { "name": "The Hindu Business Line", "id": "60573550946" },
                    { "name": "The Hindu Temple of Canton", "id": "148163135208246" }],
                "paging": {
                    "next": "https://graph.facebook.com/v2.8/search?fields=id,name,picture&type=user&q=journalism&access_token=EAACQgZBvNveQ&offset=25&limit=25&__after_id=enc_AdClDCor0"
                }
            };

            let result = {
                "data": pages.data,
                "paging": {
                    "__after_id": "enc_AdClDCor0",
                    "limit": "25",
                    "offset": "25",
                    "q": "journalism",
                    "type": "user"
                }
            };

            let params = {
                "q": keyword,
                "type": type
            };

            sandbox.stub(facebookClientInstance, "fetchSourceUrls")
                .withArgs(params).returns(Promise.resolve(pages));

            facebookRequstHandler.fetchSourceUrls(params).then(pagesData => {
                try {
                    expect(pagesData.data).to.have.lengthOf(3); // eslint-disable-line no-magic-numbers
                    expect(pagesData).to.deep.equal(result);
                    done();
                } catch (error) {
                    done(error);
                }
            });
        });

        it("_getPagingParams should return empty object properties if no path is provided", () => {
            expect(facebookRequstHandler._getPagingParams()).to.deep.equal({});
        });

        it("_getPagingParams should return empty object if path has no next property", () => {
            expect(facebookRequstHandler._getPagingParams({})).to.deep.equal({});
        });

        it("_getPagingParams should return paging parameters", () => {
            let result = {
                "__after_id": "123",
                "limit": "21",
                "offset": "20"
            };
            expect(facebookRequstHandler._getPagingParams({ "next": "facebook.com?limit=21&offset=20&__after_id=123" }))
                .to.deep.equal(result);
        });
    });

    describe("saveToken", () => {
        let facebookRequestHandler = null, couchClient = null, tokenDocument = null, documentId = null, sandbox = null;
        beforeEach("saveToken", () => {
            sandbox = sinon.sandbox.create();
            facebookRequestHandler = new FacebookRequestHandler(accessToken);
            documentId = "test_token_id";
            tokenDocument = {
                "access_token": accessToken,
                "token_type": "tokenType",
                "expires_in": 12,
                "expired_after": 123
            };
            couchClient = new CouchClient();
        });
        afterEach("saveToken", () => {
            sandbox.restore();
        });
        it("should throw an error if saveDocument is not successful", async () => {
            sandbox.mock(couchClient).expects("saveDocument").returns(Promise.reject("Unexpected Response from db"));
            try {
                await facebookRequestHandler.saveToken(couchClient, documentId, tokenDocument);
            } catch(error) {
                assert.deepEqual(new Error("error while saving facebook long lived token."), error);
            }
        });

        it("should return expired_after when saveDocument is successful", async () => {
            sandbox.mock(couchClient).expects("saveDocument").returns(Promise.resolve("successfully saved"));
            let response = await facebookRequestHandler.saveToken(couchClient, documentId, tokenDocument);
            assert.equal(tokenDocument.expired_after, response);
        });
    });
});
