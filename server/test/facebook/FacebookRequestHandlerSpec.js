/* eslint no-unused-expressions:0, max-nested-callbacks: [2, 5] */
import FacebookClient from "../../src/facebook/FacebookClient";
import FacebookRequestHandler from "../../src/facebook/FacebookRequestHandler";
import SourceConfigRequestHandler from "./../../src/sourceConfig/SourceConfigRequestHandler";
import CryptUtil from "../../src/util/CryptUtil";
import DateUtil from "../../src/util/DateUtil";
import ApplicationConfig from "../../src/config/ApplicationConfig";
import LogTestHelper from "../helpers/LogTestHelper";
import AdminDbClient from "../../src/db/AdminDbClient";
import CouchClient from "../../src/CouchClient";
import { userDetails } from "../../src/Factory";
import { assert, expect } from "chai";
import { isRejected } from "./../helpers/AsyncTestHelper";
import sinon from "sinon";

describe("FacebookRequestHandler", () => {
    const accessToken = "test_token";
    const appSecretKey = "test_secret";
    const appSecretProof = "test_secret_proof";
    const appId = "test_app_id";
    before("FacebookRequestHandler", () => {
        sinon.stub(FacebookRequestHandler, "logger").returns(LogTestHelper.instance());

        const applicationConfig = new ApplicationConfig();
        sinon.stub(ApplicationConfig, "instance").returns(applicationConfig);
        sinon.stub(applicationConfig, "facebook").returns({
            "appSecretKey": "test_secret_key",
            "appId": "test_app_id"
        });
    });

    after("FacebookRequestHandler", () => {
        FacebookRequestHandler.logger.restore();
        ApplicationConfig.instance.restore();
    });

    describe("CouchClient", () => {
        it("should throw error if the access token is empty", () => {
            const facebookRequestHandlerFunc = () => {
                return new FacebookRequestHandler(null);
            };
            assert.throw(facebookRequestHandlerFunc, Error, "access token can not be empty");
        });
    });

    describe("appSecretProof", () => {
        it("should get the encrypted access key for a facebook client access token and secret key", () => {
            const cryptUtilMock = sinon.mock(CryptUtil).expects("hmac");
            cryptUtilMock.withArgs("sha256", appSecretKey, "hex", accessToken);
            const facebookRequestHandler = new FacebookRequestHandler(accessToken);
            sinon.stub(facebookRequestHandler, "appSecretKey").returns(appSecretKey);
            facebookRequestHandler.appSecretProof();
            cryptUtilMock.verify();
            CryptUtil.hmac.restore();
        });
    });

    describe("appSecretKey", () => {
        it("should get the app secret key from the configuration file", () => {
            const facebookRequestHandler = new FacebookRequestHandler(accessToken);
            const secretKey = facebookRequestHandler.appSecretKey();

            assert.strictEqual("test_secret_key", secretKey);
        });

    });

    describe("appId", () => {
        it("should get the app Id from the configuration file", () => {
            const facebookRequestHandler = new FacebookRequestHandler(accessToken);

            assert.strictEqual("test_app_id", facebookRequestHandler.appId());
        });

    });

    describe("fetchFeeds", () => {
        let facebookClient = null;
        let sourceId = null;
        let facebookRequestHandler = null;
        let facebookClientPagePostsMock = null;
        let response = null;
        let requiredFields = null;
        let optionsJson = null;
        beforeEach("fetchFeeds", () => {
            response = {
                "docs": [{
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
                }],
                "pagiging": {
                    "since": "12943678"
                }
            };
            facebookClient = new FacebookClient(accessToken, appSecretProof);
            sinon.stub(FacebookClient, "instance").withArgs(accessToken, appSecretProof).returns(facebookClient);
            facebookClientPagePostsMock = sinon.mock(facebookClient).expects("fetchFeeds");
            sourceId = "https://www.facebook.com/TestPage";
            facebookRequestHandler = new FacebookRequestHandler(accessToken);
            sinon.stub(facebookRequestHandler, "appSecretProof").returns(appSecretProof);
            requiredFields = "link,message,picture,full_picture,name,caption,place,privacy,created_time,from";
            optionsJson = { "since": "12943678", "fields": requiredFields, "limit": 100 };
        });

        afterEach("fetchFeeds", () => {
            FacebookClient.instance.restore();
            facebookClient.fetchFeeds.restore();
            facebookRequestHandler.appSecretProof.restore();
        });

        it("should return the page posts for a given facebook web url", async() => {
            facebookClientPagePostsMock.withArgs(sourceId, "posts", optionsJson).returns(Promise.resolve(response));
            const actualFeeds = await facebookRequestHandler.fetchFeeds(sourceId, "posts", { "since": "12943678" });

            facebookClientPagePostsMock.verify();
            assert.strictEqual(actualFeeds, response);
        });

        it("should reject with error if there is error while fetching facebook id", async() => {
            facebookClientPagePostsMock.withArgs(sourceId, "posts", optionsJson).returns(Promise.reject("test"));

            await isRejected(facebookRequestHandler.fetchFeeds(sourceId, "posts", { "since": "12943678" }), `error fetching facebook feeds of web url = ${sourceId}`);
        });

    });

    describe("setToken", () => {
        let sandbox = null;
        let facebookRequestHandler = null;
        let facebookClientPagePostsMock = null;
        const currentTime = 123486;
        const milliSeconds = 1000;

        beforeEach("setToken", () => {
            sandbox = sinon.sandbox.create();
            const facebookClient = new FacebookClient(accessToken, appSecretProof, appId);
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
            const expiresIn = 12345;
            const expiredAfter = 12468486;
            const tokenResponse = { "expires_in": expiresIn };
            facebookClientPagePostsMock.returns(Promise.resolve(tokenResponse));
            const adminDbClient = new AdminDbClient();
            sandbox.mock(AdminDbClient).expects("instance").returns(Promise.resolve(adminDbClient));
            sandbox.mock(userDetails).expects("getUser").returns({ "userName": "userName" });
            sandbox.mock(adminDbClient).expects("getDocument").returns(Promise.reject("error occured while getting the document"));
            sandbox.mock(facebookRequestHandler).expects("saveToken").returns(Promise.resolve(expiredAfter));
            try {
                const response = await facebookRequestHandler.setToken("test");
                assert.equal(response, currentTime + (tokenResponse.expires_in * milliSeconds));
            } catch (error) {
                assert.fail(error);
            }
        });

        it("should update document for long lived token if document is there", async() => {
            const expiresIn = 12345;
            const document = {
                "access_token": "accessToken",
                "token_type": "tokenType",
                "expires_in": expiresIn,
                "expired_after": 345
            };
            const tokenResponse = {
                "access_token": "accessToken",
                "token_type": "tokenType",
                "expires_in": expiresIn,
                "expired_after": 345
            };
            facebookClientPagePostsMock.returns(Promise.resolve(tokenResponse));
            const expiredAfter = 345;
            const couchClient = new CouchClient();
            const adminDbClient = new AdminDbClient();
            sandbox.mock(AdminDbClient).expects("instance").returns(Promise.resolve(adminDbClient));
            sandbox.mock(CouchClient).expects("instance").returns(couchClient);
            sandbox.mock(adminDbClient).expects("getDocument").returns(Promise.resolve(document));
            sandbox.mock(facebookRequestHandler).expects("saveToken").returns(Promise.resolve(expiredAfter));
            sandbox.mock(userDetails).expects("getUser").withArgs("test").returns({ "userName": "userName" });
            try {
                const response = await facebookRequestHandler.setToken("test");
                assert.equal(response, expiredAfter);
            } catch (error) {
                assert.fail(error);
            }
        });

        it("should throw error if long lived token not fetched", async() => {
            facebookClientPagePostsMock.returns(Promise.reject("error"));
            try {
                await facebookRequestHandler.setToken("test");
                assert.fail();
            } catch(error) {
                assert.deepEqual(error.message, "error getting long lived token with token " + accessToken);
            }
        });
    });

    describe("fetchProfiles", () => {
        let sandbox = null;
        let facebookClient = null;
        let facebookRequestHandler = null;
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
            const profiles = {
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
        let sandbox = null;
        const keyword = "TheHindu";
        const type = "page";
        let facebookRequstHandler = null;
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

        it("should get facebook pages", async() => {
            const pages = {
                "data": [
                    { "name": "The Hindu", "id": "163974433696568" },
                    { "name": "The Hindu Business Line", "id": "60573550946" },
                    { "name": "The Hindu Temple of Canton", "id": "148163135208246" }],
                "paging": {
                    "cursors": {
                        "after": "enc_AdClDCor0"
                    },
                    "next": "https://graph.facebook.com/v2.8/search?fields=id,name,picture,full_picture&type=user&q=journalism&access_token=EAACQgZBvNveQ&offset=25&limit=25&__after_id=enc_AdClDCor0"
                }
            };

            const result = {
                "data": pages.data,
                "paging": {
                    "after": "enc_AdClDCor0"
                }
            };

            const params = {
                "q": keyword,
                "type": type
            };

            sandbox.stub(facebookClientInstance, "fetchSourceUrls")
                .withArgs(params).returns(Promise.resolve(pages));

            const pagesData = await facebookRequstHandler.fetchSourceUrls(params);

            expect(pagesData).to.deep.equal(result);
        });

        it("should get facebook users", async() => {
            const users = {
                "data": [
                    { "name": "The Hindu", "id": "163974433696568" },
                    { "name": "The Hindu Business Line", "id": "60573550946" },
                    { "name": "The Hindu Temple of Canton", "id": "148163135208246" }],
                "paging": {
                    "next": "https://graph.facebook.com/v2.8/search?fields=id,name,picture,full_picture&type=user&q=journalism&access_token=EAACQgZBvNveQ&offset=25&limit=25&__after_id=enc_AdClDCor0"
                }
            };

            const result = {
                "data": users.data,
                "paging": {
                    "__after_id": "enc_AdClDCor0",
                    "limit": "25",
                    "offset": "25",
                    "q": "journalism",
                    "type": "user"
                }
            };

            const params = {
                "q": keyword,
                "type": "user"
            };

            sandbox.stub(facebookClientInstance, "fetchSourceUrls")
                .withArgs(params).returns(Promise.resolve(users));

            const pagesData = await facebookRequstHandler.fetchSourceUrls(params);

            expect(pagesData).to.deep.equal(result);
        });

        it("_getPagingParams should return empty object properties if no path is provided", () => {
            expect(facebookRequstHandler._getPagingParams()).to.deep.equal({});
        });

        it("_getPagingParams should return empty object if path has no next property", () => {
            expect(facebookRequstHandler._getPagingParams({})).to.deep.equal({});
        });

        it("_getPagingParams should return paging parameters", () => {
            const result = {
                "__after_id": "123",
                "limit": "21",
                "offset": "20"
            };
            expect(facebookRequstHandler._getPagingParams({ "next": "facebook.com?limit=21&offset=20&__after_id=123" }))
                .to.deep.equal(result);
        });
    });

    describe("saveToken", () => {
        let facebookRequestHandler = null;
        let couchClient = null;
        let tokenDocument = null;
        let documentId = null;
        let sandbox = null;
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

        it("should throw an error if saveDocument is not successful", async() => {
            sandbox.mock(couchClient).expects("saveDocument").returns(Promise.reject("Unexpected Response from db"));
            try {
                await facebookRequestHandler.saveToken(couchClient, documentId, tokenDocument);
            } catch(error) {
                assert.deepEqual(error.message, "error while saving facebook long lived token.");
            }
        });

        it("should return expired_after when saveDocument is successful", async() => {
            sandbox.mock(couchClient).expects("saveDocument").returns(Promise.resolve("successfully saved"));
            const response = await facebookRequestHandler.saveToken(couchClient, documentId, tokenDocument);
            assert.equal(tokenDocument.expired_after, response);
        });
    });

    describe("configureFacebookPage", () => {
        const sandbox = sinon.sandbox.create();
        let facebookClient = null;
        const pageUrl = "https://facebook.com/test";
        const facebookReqHandler = new FacebookRequestHandler(accessToken);
        beforeEach("configureFacebookPage", () => {
            facebookClient = new FacebookClient(accessToken, appSecretProof, appId);
            sandbox.stub(FacebookClient, "instance").returns(facebookClient);
        });

        afterEach("configureFacebookPage", () => {
            sandbox.restore();
        });

        it("should return page info after saving the page", async() => {
            sandbox.stub(facebookClient, "getFacebookPageInfo")
                .returns(Promise.resolve({ "name": "test_id", "id": "12345678" }));

            const sourceConfigReq = new SourceConfigRequestHandler();
            sandbox.stub(SourceConfigRequestHandler, "instance").returns(sourceConfigReq);

            const configMock = sandbox.mock(sourceConfigReq).expects("addConfiguredSource");
            configMock.withExactArgs("fb_page", [{ "name": "test_id", "url": "12345678" }], accessToken).returns(Promise.resolve({ "ok": true }));

            const response = await facebookReqHandler.configureFacebookPage(pageUrl, accessToken);

            configMock.verify();
            expect(response).to.deep.equals({ "name": "test_id", "id": "12345678" });
        });

        it("should throw an error if it is unable to add the page to configured list", async() => {
            sandbox.stub(facebookClient, "getFacebookPageInfo")
                .returns(Promise.reject());

            await isRejected(facebookReqHandler.configureFacebookPage(pageUrl, accessToken),
                `Unable to add the page: ${pageUrl}`);
        });
    });
});
