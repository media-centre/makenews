/* eslint max-nested-callbacks: [2, 5],no-undefined: 0 */

"use strict";
import { mainHeaderLocale } from "../../src/js/main/reducers/MainReducer.js";
import Locale from "../../src/js/utils/Locale.js";
import { assert } from "chai";
import sinon from "sinon";

describe("Main Reducer", () => {

    describe("mainHeaderLocale", () => {
        it("should return main header strings in English by default", () => {
            let applicationStrings = {
                "locales": ["en"],
                "messages": {
                    "headerStrings": {
                        "surfTab": {
                            "Name": "Surf"
                        },
                        "parkTab": {
                            "Name": "Park"
                        },
                        "LogoutButton": {
                            "Name": "Logout"
                        }
                    }
                }
            };

            let applicationStringsMock = sinon.mock(Locale).expects("applicationStrings");
            applicationStringsMock.returns(applicationStrings);
            let headerLocale = mainHeaderLocale();
            assert.strictEqual("Park", headerLocale.parkTab.Name);
            applicationStringsMock.verify();
            Locale.applicationStrings.restore();
        });
    });
});
