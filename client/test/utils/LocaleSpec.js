/* eslint max-nested-callbacks: [2, 5]*/
import Locale from "../../src/js/utils/Locale";
import AppWindow from "../../src/js/utils/AppWindow";
import { assert } from "chai";
import sinon from "sinon";

describe("Locale", function() {

    before("Locale", () => {
        const appWindow = new AppWindow();
        sinon.stub(appWindow, "get").withArgs("appEn").returns({ "locales": ["en"] });
        sinon.stub(AppWindow, "instance").returns(appWindow);
    });

    after("Locale", () => {
        AppWindow.instance.restore();
    });

    describe("applicationStrings", () => {
        it("should return the english locale strings of the application", () => {
            const englishStringsFile = Locale.applicationStrings("en");
            assert.strictEqual("en", englishStringsFile.locales[0]); // eslint-disable-line no-magic-numbers
        });
        it("should thow an error if the language is not passed", () => {
            const applicationStringsFunc = () => {
                Locale.applicationStrings(null);
            };
            assert.throw(applicationStringsFunc, Error, "language can not be null");
        });

        it("should return the english locale strings as default", () => {
            const englishStringsFile = Locale.applicationStrings();
            assert.strictEqual("en", englishStringsFile.locales[0]); // eslint-disable-line no-magic-numbers
        });

        it("should return the english locale strings for all the languages other than english", () => {
            const englishStringsFile = Locale.applicationStrings("fr");
            assert.strictEqual("en", englishStringsFile.locales[0]); // eslint-disable-line no-magic-numbers
        });

    });
});
