/* eslint no-unused-expressions:0, max-nested-callbacks: [2, 5] */

"use strict";
import {populateCategoryDetails, DISPLAY_CATEGORY} from "../../src/js/config/actions/CategoryActions.js";
import AllCategoriesDb from "../../src/js/config/db/CategoryDb.js";
import { expect } from "chai";

describe("CategoryActions", () => {
    describe("populateCategoryDetails", () => {
        it("return type DISPLAY_CATEGORY action", function() {
            let categoryName = "Sports";
            let categoryDocument = {RSSFeeds: ["url1", "url2"], FaceBook:[], Twitter: []};
            expect(populateCategoryDetails(categoryDocument, categoryName)).to.deep.equal(
                                { "type": DISPLAY_CATEGORY, categoryDocument, categoryName });
        });
    });

});

