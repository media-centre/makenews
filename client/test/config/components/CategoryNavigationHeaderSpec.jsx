/* eslint no-magic-numbers:0 no-unused-expressions:0, max-nested-callbacks: [2, 5] */
"use strict";
import "../../helper/TestHelper.js";
import CategoryNavigationHeader from "../../../src/js/config/components/CategoryNavigationHeader.jsx";
import { assert } from "chai";
import React from "react";
import TestUtils from "react-addons-test-utils";


describe("CategoryNavigationHeader", ()=> {
    let categoryNavigationHeaderComponent = null, categoriyDetailsPageStrings = null;
    before("CategoryNavigationHeader", () => {
        categoriyDetailsPageStrings = {
            "allCategoriesLinkLabel": "All Categories Test",
            "deleteCategoryLinkLabel": "Delete Category Test",
            "addUrlLinkLabel": "Add Url Test"
        };
        categoryNavigationHeaderComponent = TestUtils.renderIntoDocument(
            <CategoryNavigationHeader categoryName="Test Category Name" categoriyDetailsPageStrings={categoriyDetailsPageStrings}/>
        );
    });

    it("Should display all categories text from the language file", () => {
        assert.strictEqual(categoriyDetailsPageStrings.allCategoriesLinkLabel, categoryNavigationHeaderComponent.refs.allCategoriesLinkLabel.innerHTML);
    });

    it("Should display delete category text from the language file", () => {
        assert.strictEqual(categoriyDetailsPageStrings.deleteCategoryLinkLabel, categoryNavigationHeaderComponent.refs.deleteCategoryLinkLabel.innerHTML);
    });

});
