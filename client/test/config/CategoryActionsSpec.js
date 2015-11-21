/* eslint no-unused-expressions:0, max-nested-callbacks: [2, 5] */

"use strict";
import { populateCategoryDetails, DISPLAY_CATEGORY } from "../../src/js/config/actions/CategoryActions.js";
import { expect } from "chai";

describe("CategoryActions", () => {
    describe("populateCategoryDetails", () => {
        it("return type DISPLAY_CATEGORY action", function() {
            let sourceUrlsObj = { "rss": {}, "facebook": {}, "twitter": {} };
            expect(populateCategoryDetails(sourceUrlsObj)).to.deep.equal(
                                { "type": DISPLAY_CATEGORY, sourceUrlsObj });
        });
    });
});


