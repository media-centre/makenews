/* eslint max-nested-callbacks:0 */

"use strict";

import ApplicationConfig from "../../src/config/ApplicationConfig.js";
import EnvironmentConfig from "../../src/config/EnvironmentConfig.js";
import sinon from "sinon";
import { assert } from "chai";

describe("ApplicationConfig", () => {

    describe("dbUrl", () => {

        it("should return db URL from application configuration file", ()=> {
            let result = {
                "get": ()=> {
                    return "test";
                }
            };

            let environmentConfigStub = sinon.stub(EnvironmentConfig, "instance");
            environmentConfigStub.withArgs(EnvironmentConfig.files.APPLICATION).returns(result);

            let url = ApplicationConfig.dbUrl();
            assert.strictEqual("test", url);
            EnvironmentConfig.instance.restore();
        });
    });
});
