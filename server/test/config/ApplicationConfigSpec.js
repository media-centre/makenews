/* eslint max-nested-callbacks:0, no-magic-numbers:0 */

"use strict";

import ApplicationConfig from "../../src/config/ApplicationConfig.js";
import EnvironmentConfig from "../../src/config/EnvironmentConfig.js";
import sinon from "sinon";
import { assert } from "chai";

describe("ApplicationConfig", () => {
    let environmentConfigStub = null, applicationConfig = null;
    beforeEach("ApplicationConfig", () => {
        let applicationJson = {
            "get": (config)=> {
                let json = {
                    "serverIpAddress": "http://localhost",
                    "serverPort": 5000,
                    "couchDbUrl": "http://localhost:5984",
                    "userDbPrefix": "test_prefix",
                    "adminDetails": {
                        "username": "admin",
                        "password": "admin",
                        "db": "admin"
                    },
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
        applicationConfig = new ApplicationConfig();
    });

    afterEach("ApplicationConfig", () => {
        EnvironmentConfig.instance.restore();
    });

    describe("dbUrl", () => {

        it("should return db URL from application configuration file", ()=> {

            assert.strictEqual("http://localhost:5984", applicationConfig.dbUrl());
        });
    });

    describe("userDbPrefix", () => {
        it("should return user db prefix", () => {
            assert.strictEqual(applicationConfig.userDbPrefix(), "test_prefix");
        });
    });

    describe("adminDetails", () => {

        it("should return admin details from application configuration file", ()=> {
            let adminDetails = new ApplicationConfig().adminDetails();
            assert.strictEqual("admin", adminDetails.username);
            assert.strictEqual("admin", adminDetails.password);
            assert.strictEqual("admin", adminDetails.db);
        });
    });

    describe("facebook", () => {
        it("should return facebook url from application configuration file", ()=> {

            let facebookConfig = applicationConfig.facebook();

            assert.strictEqual("https://graph.facebook.com/v2.5", facebookConfig.url);
            assert.strictEqual("appSecretKey", facebookConfig.appSecretKey);
            assert.equal(10000, facebookConfig.timeOut);
        });
    });

    describe("twitter", () => {
        it("should return twitter url from application configuration file", ()=> {

            let twitterConfig = applicationConfig.twitter();
            assert.strictEqual("https://api.twitter.com/1.1", twitterConfig.url);
            assert.strictEqual("BearerToken", twitterConfig.bearerToken);
            assert.equal(10000, twitterConfig.timeOut);
        });
    });

    describe("serverIpAddress", () => {
        it("should return the server ip address from the application configuration file", ()=> {
            let serverIpAddress = applicationConfig.serverIpAddress();
            assert.strictEqual("http://localhost", serverIpAddress);
        });
    });

    describe("serverPort", () => {
        it("should return the server port from the application configuration file", ()=> {
            let serverPort = applicationConfig.serverPort();
            assert.strictEqual(5000, serverPort);
        });
    });

});
