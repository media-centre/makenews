/* eslint max-nested-callbacks:0, no-magic-numbers:0 */

"use strict";

import ApplicationConfig from "../../src/config/ApplicationConfig.js";
import EnvironmentConfig from "../../src/config/EnvironmentConfig.js";
import sinon from "sinon";
import { assert } from "chai";

describe("ApplicationConfig", () => {
    let environmentConfigStub = null;
    beforeEach("ApplicationConfig", () => {
        let applicationJson = {
            "get": (config)=> {
                let json = {
                    "serverIpAddress": "localhost",
                    "serverPort": 5000,
                    "couchDbUrl": "http://localhost:5984",
                    "facebook": {
                        "url": "https://graph.facebook.com/v2.5",
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
    });

    afterEach("ApplicationConfig", () => {
        EnvironmentConfig.instance.restore();
    });

    describe("dbUrl", () => {

        it("should return db URL from application configuration file", ()=> {
            let applicationConfig = new ApplicationConfig();
            assert.strictEqual("http://localhost:5984", applicationConfig.dbUrl());
        });
    });

    describe("facebook", () => {
        it("should return facebook url from application configuration file", ()=> {
            let applicationConfig = new ApplicationConfig();
            let facebookConfig = applicationConfig.facebook();

            assert.strictEqual("https://graph.facebook.com/v2.5", facebookConfig.url);
            assert.strictEqual("appSecretKey", facebookConfig.appSecretKey);
            assert.equal(10000, facebookConfig.timeOut);
        });
    });

    describe("twitter", () => {
        it("should return twitter url from application configuration file", ()=> {
            let applicationConfig = new ApplicationConfig();
            let twitterConfig = applicationConfig.twitter();
            assert.strictEqual("https://api.twitter.com/1.1", twitterConfig.url);
            assert.strictEqual("BearerToken", twitterConfig.bearerToken);
            assert.equal(10000, twitterConfig.timeOut);
        });
    });

});
