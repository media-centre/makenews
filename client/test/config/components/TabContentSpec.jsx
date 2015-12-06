/* eslint no-magic-numbers:0 no-unused-expressions:0, max-nested-callbacks: [2, 5] */
"use strict";
import "../../helper/TestHelper.js";
import TabContent from "../../../src/js/config/components/TabControl/TabContent.jsx";
import { assert } from "chai";
import React from "react";
import TestUtils from "react-addons-test-utils";


describe("Tab Content", ()=> {
    let content = {}, tabContentComponent = null, categoriyDetailsPageStrings = null;
    before("Tab Content", () => {
        content = {
            "details": [{ "_id": "id1", "url": "one detail" }],
            "name": "one"
        };
        categoriyDetailsPageStrings = {
            "allCategoriesLinkLabel": "All Categories Test",
            "deleteCategoryLinkLabel": "Delete Category Test",
            "addUrlLinkLabel": "Add Url Test"
        };
        tabContentComponent = TestUtils.renderIntoDocument(
            <TabContent title={content.name} content={content.details} categoryName={content.name} categoriyDetailsPageStrings = {categoriyDetailsPageStrings}/>
        );
    });

    it("Should display Add Url text from the language file", () => {
        assert.strictEqual(categoriyDetailsPageStrings.addUrlLinkLabel, tabContentComponent.refs.addUrlLinkTex.innerHTML);
    });
});
