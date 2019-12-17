/* eslint no-unused-expressions:0, max-nested-callbacks: [2, 5] */

import EnvironmentReader from "../../src/environment/EnvironmentReader";
import chai from "chai";
const assert = chai.assert;

describe("Environment", () => {
    describe("Environment", () => {
        it("should throw Error if environment file is null", () => {
            const envFunc = function() {
                return new EnvironmentReader(null, "production");
            };
            assert.throw(envFunc, Error, "envFile or environment can not be empty");
        });

        it("should throw Error if the environment is null", () => {
            const envFunc = function() {
                return new EnvironmentReader({}, "");
            };
            assert.throw(envFunc, Error, "envFile or environment can not be empty");
        });

        it("should not throw Error if the valid environment json and valid environemnt arguments passed", () => {
            const envFunc = function() {
                return new EnvironmentReader({}, "production");
            };
            assert.doesNotThrow(envFunc);
        });

        it("should return the type of environemnt", () => {
            const env = new EnvironmentReader({}, "production");
            assert.strictEqual(env.getEnvironment(), "production");
        });

    });

    describe("get", () => {
        it("should include default parameters by default", () => {
            const envJson = {
                "default": {
                    "key1": "value 1",
                    "key2": "value 2"
                }
            };
            const env = new EnvironmentReader(envJson, "production");
            assert.strictEqual(env.get("key1"), "value 1");
            assert.strictEqual(env.get("key2"), "value 2");
        });

        it("should override with environment parameters of the specified environment", () => {
            const envJson = {
                "default": {
                    "key1": "value 1",
                    "key2": "value 2"
                },
                "production": {
                    "key1": "production value 1"
                },
                "development": {
                    "key2": "development value 1"
                }
            };
            const env = new EnvironmentReader(envJson, "production");
            assert.strictEqual(env.get("key1"), "production value 1");
            assert.strictEqual(env.get("key2"), "value 2");
        });

        it("should return undefiend if the parameter is not in default parameters or in specified environment", () => {
            const envJson = {
                "default": {
                    "key1": "value 1",
                    "key2": "value 2"
                }
            };
            const env = new EnvironmentReader(envJson, "production");
            assert.strictEqual(env.get("key1"), "value 1");
            assert.isUndefined(env.get("key3"));
        });
    });
});
