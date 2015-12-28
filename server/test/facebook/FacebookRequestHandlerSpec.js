/* eslint no-unused-expressions:0, max-nested-callbacks: [2, 5] */

"use strict";
import FacebookClient from "../../src/facebook/FacebookClient.js";
import FacebookRequestHandler from "../../src/facebook/FacebookRequestHandler.js";
import CryptUtil from "../../src/util/CryptUtil.js";
import EnvironmentConfig from "../../src/config/EnvironmentConfig.js";
import { assert } from "chai";
import sinon from "sinon";

describe("FacebookRequestHandler", () => {
    let accessToken = null, appSecretKey = null, appSecretProof = null, pageName = null;
    before("pageFeeds", () => {
        accessToken = "test_token";
        appSecretKey = "test_secret";
        appSecretProof = "test_secret_proof";
        pageName = "thehindu";
    });

    describe("constructor", () => {
        it("should throw error if the access token is empty", () => {
            let facebookRequestHandlerFunc = () => {
                return new FacebookRequestHandler(null);
            };
            assert.throw(facebookRequestHandlerFunc, Error, "access token can not be empty");
        });
    });

    describe("pageFeeds", () => {
        it("should throw error if the access token is empty", (done) => {
            let facebookRequestHandler = new FacebookRequestHandler(accessToken);
            facebookRequestHandler.pagePosts(null).catch(error => {
                assert.strictEqual("page name can not be null", error);
                done();
            });
        });

        it("should resolve feeds for a public page", (done) => {
            let actualFeeds = [
                {
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
                }];

            let facebookClient = new FacebookClient(accessToken, appSecretProof);
            let facebookClientInstanceMock = sinon.mock(FacebookClient).expects("instance");
            facebookClientInstanceMock.withArgs(accessToken, appSecretProof).returns(facebookClient);
            sinon.stub(facebookClient, "pagePosts").withArgs(pageName).returns(Promise.resolve(actualFeeds));
            let facebookRequestHandler = new FacebookRequestHandler(accessToken);
            sinon.stub(facebookRequestHandler, "appSecretProof").returns(appSecretProof);
            facebookRequestHandler.pagePosts(pageName).then(feeds => {
                assert.deepEqual(actualFeeds, feeds);
                facebookClientInstanceMock.verify();
                FacebookClient.instance.restore();
                facebookClient.pagePosts.restore();
                done();
            });
        });

        it("should reject error message if there is any error while fetching feeds from public page", (done) => {
            let facebookClient = new FacebookClient(accessToken, appSecretProof);
            let facebookClientInstanceMock = sinon.mock(FacebookClient).expects("instance");
            facebookClientInstanceMock.withArgs(accessToken, appSecretProof).returns(facebookClient);
            sinon.stub(facebookClient, "pagePosts").withArgs(pageName).returns(Promise.reject({
                "message": "Error validating access token: Session has expired on Thursday, 10-Dec-15 04:00:00 PST. The current time is Thursday, 10-Dec-15 20:23:54 PST.",
                "type": "OAuthException",
                "code": 190,
                "error_subcode": 463,
                "fbtrace_id": "AWpk5h2ceG6"
            }));

            let facebookRequestHandler = new FacebookRequestHandler(accessToken);
            sinon.stub(facebookRequestHandler, "appSecretProof").returns(appSecretProof);
            facebookRequestHandler.pagePosts(pageName).catch(error => {
                assert.strictEqual("error fetching feeds for a " + pageName + " page.", error);
                facebookClientInstanceMock.verify();
                FacebookClient.instance.restore();
                facebookClient.pagePosts.restore();
                done();
            });
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
        let applicationConfigFile = null;
        before("appSecretKey", () => {
            applicationConfigFile = {
                "get": (key) => { //eslint-disable-line no-unused-vars
                    return {
                        "appSecretKey": "test_secret_key"
                    };
                }
            };
        });
        it("should get the app secret key from the configuration file", () => {

            let environmentConfigMock = sinon.mock(EnvironmentConfig);
            environmentConfigMock.expects("instance").withArgs(EnvironmentConfig.files.APPLICATION).returns(applicationConfigFile);

            let facebookRequestHandler = new FacebookRequestHandler(accessToken);
            let secretKey = facebookRequestHandler.appSecretKey();
            assert.strictEqual("test_secret_key", secretKey);
            environmentConfigMock.verify();
            environmentConfigMock.restore();
        });

    });

});
