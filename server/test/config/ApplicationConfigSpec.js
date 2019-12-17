/* eslint max-nested-callbacks:0, no-magic-numbers:0 */
import ApplicationConfig from "../../src/config/ApplicationConfig";
import EnvironmentConfig from "../../src/config/EnvironmentConfig";
import sinon from "sinon";
import { assert } from "chai";

describe("ApplicationConfig", () => {
    let environmentConfigStub = null;
    let applicationConfig = null;
    beforeEach("ApplicationConfig", () => {
        const applicationJson = {
            "get": (config)=> {
                const json = {
                    "serverIpAddress": "http://localhost",
                    "serverPort": 5000,
                    "couchDbUrl": "http://localhost:5984",
                    "searchEngineUrl": "http://searchEngine.url",
                    "userDbPrefix": "test_prefix",
                    "adminDetails": {
                        "username": "admin",
                        "password": "admin",
                        "db": "admin"
                    },
                    "facebook": {
                        "url": "https://graph.facebook.com/v2.8",
                        "appSecretKey": "appSecretKey",
                        "timeOut": 10000
                    },
                    "twitter": {
                        "url": "https://api.twitter.com/1.1",
                        "bearerToken": "BearerToken",
                        "timeOut": 10000
                    }
                };
                return json[config];
            }
        };
        environmentConfigStub = sinon.stub(EnvironmentConfig, "instance");
        environmentConfigStub.withArgs(EnvironmentConfig.files.APPLICATION).returns(applicationJson);
        applicationConfig = new ApplicationConfig();
    });

    afterEach("ApplicationConfig", () => {
        EnvironmentConfig.instance.restore();
    });

    describe("dbUrl", () => {

        it("should return db URL from application configuration file", ()=> {

            assert.strictEqual(applicationConfig.dbUrl(), "http://localhost:5984");
        });
    });

    describe("searchEngineUrl", () => {

        it("should return searchEngine URL from application configuration file", ()=> {

            assert.strictEqual(applicationConfig.searchEngineUrl(), "http://searchEngine.url");
        });
    });

    describe("userDbPrefix", () => {
        it("should return user db prefix", () => {
            assert.strictEqual(applicationConfig.userDbPrefix(), "test_prefix");
        });
    });

    describe("adminDetails", () => {

        it("should return admin details from application configuration file", ()=> {
            const adminDetails = new ApplicationConfig().adminDetails();
            assert.strictEqual(adminDetails.username, "admin");
            assert.strictEqual(adminDetails.password, "admin");
            assert.strictEqual(adminDetails.db, "admin");
        });
    });

    describe("facebook", () => {
        it("should return facebook url from application configuration file", ()=> {

            const facebookConfig = applicationConfig.facebook();

            assert.strictEqual(facebookConfig.url, "https://graph.facebook.com/v2.8");
            assert.strictEqual(facebookConfig.appSecretKey, "appSecretKey");
            assert.equal(facebookConfig.timeOut, 10000);
        });
    });

    describe("twitter", () => {
        it("should return twitter url from application configuration file", ()=> {

            const twitterConfig = applicationConfig.twitter();
            assert.strictEqual(twitterConfig.url, "https://api.twitter.com/1.1");
            assert.strictEqual(twitterConfig.bearerToken, "BearerToken");
            assert.equal(twitterConfig.timeOut, 10000);
        });
    });

    describe("serverIpAddress", () => {
        it("should return the server ip address from the application configuration file", ()=> {
            const serverIpAddress = applicationConfig.serverIpAddress();
            assert.strictEqual(serverIpAddress, "http://localhost");
        });
    });

    describe("serverPort", () => {
        it("should return the server port from the application configuration file", ()=> {
            const serverPort = applicationConfig.serverPort();
            assert.strictEqual(serverPort, 5000);
        });
    });
});
