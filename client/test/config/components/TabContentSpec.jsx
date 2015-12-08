/* eslint no-magic-numbers:0 no-unused-expressions:0, max-nested-callbacks: [2, 5] */
"use strict";
import "../../helper/TestHelper.js";
import RSSComponent from "../../../src/js/config/components/RSSComponent.jsx";
import { assert } from "chai";
import React from "react";
import TestUtils from "react-addons-test-utils";


describe("Tab Content", ()=> {
    let content = {}, tabContentComponent = null, categoryDetailsPageStrings = null;
    before("Tab Content", () => {
        content = {
            "details": [{ "_id": "id1", "url": "one detail" }],
            "name": "one"
        };
        categoryDetailsPageStrings = {
            "allCategoriesLinkLabel": "All Categories Test",
            "deleteCategoryLinkLabel": "Delete Category Test",
            "addUrlLinkLabel": "Add Url Test"
        };
        tabContentComponent = TestUtils.renderIntoDocument(
            <RSSComponent title={content.name} content={content.details} categoryName={content.name} categoryDetailsPageStrings = {categoryDetailsPageStrings}/>
        );
    });

    it("Should display Add Url text from the language file", () => {
        assert.strictEqual(categoryDetailsPageStrings.addUrlLinkLabel, tabContentComponent.refs.addUrlLinkTex.innerHTML);
    });
});
