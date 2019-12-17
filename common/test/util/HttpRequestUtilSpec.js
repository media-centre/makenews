/*eslint max-nested-callbacks:0*/

import { constructQueryString } from "../../src/util/HttpRequestUtil";
import { assert } from "chai";

describe("HttpRequestUtil", () => {
    describe("parameters", () => {
        let options = null;
        before("parameters", () => {
            options = {
                "parameter1": "value1",
                "parameter2": "value2",
                "parameter3": "value3,value4"
            };
        });

        it("should convert the options to query parameters in encoded format", () => {
            const expectedParameters = "parameter1=value1&parameter2=value2&parameter3=value3%2Cvalue4";
            const parameters = constructQueryString(options);
            assert.strictEqual(expectedParameters, parameters);
        });

        it("should convert the options to query parameters in non encoded format", () => {
            const expectedParameters = "parameter1=value1&parameter2=value2&parameter3=value3,value4";
            const parameters = constructQueryString(options, false);
            assert.strictEqual(expectedParameters, parameters);
        });

        it("should return empty string if no parameters passed", () => {
            assert.strictEqual("", constructQueryString({}));
        });
    });
});
