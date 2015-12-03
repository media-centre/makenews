/* eslint max-nested-callbacks: [2, 5]*/
"use strict";
import Locale from "../../src/js/utils/Locale.js";
import { assert } from "chai";

describe("Locale", function() {
    describe("applicationStrings", () => {
        it("should return the english locale strings of the application", () => {
            let englishStringsFile = Locale.applicationStrings("en");
            assert.strictEqual("en", englishStringsFile.locales[0]);
        });
        it("should thow an error if the language is not passed", () => {
            let applicationStringsFunc = () => {
                Locale.applicationStrings(null);
            };
            assert.throw(applicationStringsFunc, Error, "language can not be null");
        });

        it("should return the english locale strings as default", () => {
            let englishStringsFile = Locale.applicationStrings();
            assert.strictEqual("en", englishStringsFile.locales[0]);
        });

        it("should return the english locale strings for all the languages other than english", () => {
            let englishStringsFile = Locale.applicationStrings("fr");
            assert.strictEqual("en", englishStringsFile.locales[0]);
        });

    });
});
