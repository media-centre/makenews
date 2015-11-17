/* eslint no-unused-expressions:0, max-nested-callbacks: [2, 5] */

"use strict";
import {populateCategoryDetails, DISPLAY_CATEGORY} from "../../src/js/config/actions/CategoryActions.js";
import AllCategoriesDb from "../../src/js/config/db/CategoryDb.js";
import { assert } from "chai";
import sinon from "sinon";

describe("CategoryActions", () => {
    it("return type DISPLAY_CATEGORY action", function() {
        let categoryName = "Sports";
        let categoryDocument = {RSSFeeds: ["url1", "url2"], FaceBook:[], Twitter: []};
        assert.deepEqual(populateCategoryDetails(categoryDocument, categoryName),
                            { "type": DISPLAY_CATEGORY, categoryDocument, categoryName });
    });

});

