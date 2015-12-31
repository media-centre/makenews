/* eslint no-magic-numbers:0 no-unused-expressions:0, max-nested-callbacks: [2, 5] */
"use strict";
import "../../helper/TestHelper.js";
import CategoryNavigationHeader from "../../../src/js/config/components/CategoryNavigationHeader.jsx";
import CategoryDb from "../../../src/js/config/db/CategoryDb";

import { assert } from "chai";
import React from "react";
import TestUtils from "react-addons-test-utils";
import sinon from "sinon";

describe("CategoryNavigationHeader", ()=> {
    let categoryNavigationHeaderComponent = null, categoryDetailsPageStrings = null;
    before("CategoryNavigationHeader", () => {
        categoryDetailsPageStrings = {
            "allCategoriesLinkLabel": "All Categories Test",
            "deleteCategoryLinkLabel": "Delete Category Test",
            "addUrlLinkLabel": "Add Url Test"
        };
        categoryNavigationHeaderComponent = TestUtils.renderIntoDocument(
            <CategoryNavigationHeader categoryName="Test Category Name" categoryId="Test Category id" categoryDetailsPageStrings={categoryDetailsPageStrings}/>
        );
    });

    it("Should display all categories text from the language file", () => {
        assert.strictEqual(categoryDetailsPageStrings.allCategoriesLinkLabel, categoryNavigationHeaderComponent.refs.allCategoriesLinkLabel.innerHTML);
    });

    it("Should display delete category text from the language file", () => {
        const deleteCategoryLinkLabel = categoryNavigationHeaderComponent.refs.deleteCategoryLinkLabel;
        assert.strictEqual(categoryDetailsPageStrings.deleteCategoryLinkLabel, deleteCategoryLinkLabel.innerHTML);
        assert.isUndefined(categoryNavigationHeaderComponent.refs.confirmPopup);
    });

    it("Should delete category if delete category is called and confirmed", (done) => {
        const deleteCategoryLinkLabel = categoryNavigationHeaderComponent.refs.deleteCategoryLinkLabel;
        assert.strictEqual(categoryDetailsPageStrings.deleteCategoryLinkLabel, deleteCategoryLinkLabel.innerHTML);
        let deleteCategoryMock = sinon.mock(CategoryDb);
        deleteCategoryMock.expects("deleteCategory").returns(Promise.resolve(true));
        TestUtils.Simulate.click(deleteCategoryLinkLabel);
        assert.isDefined(categoryNavigationHeaderComponent.refs.confirmPopup);
        assert.strictEqual(categoryNavigationHeaderComponent.refs.confirmPopup.props.description, "Category will be permanently deleted. You will not get feeds from this category.");
        TestUtils.Simulate.click(categoryNavigationHeaderComponent.refs.confirmPopup.refs.confirmButton);
        deleteCategoryMock.verify();
        deleteCategoryMock.restore();
    });

    it("Should stay in same page if delete category is called and not confirmed", () => {
        const deleteCategoryLinkLabel = categoryNavigationHeaderComponent.refs.deleteCategoryLinkLabel;
        assert.strictEqual(categoryDetailsPageStrings.deleteCategoryLinkLabel, deleteCategoryLinkLabel.innerHTML);
        let confirmMock = sinon.mock(window);
        let deleteCategoryStub = sinon.stub(CategoryDb, "deleteCategory");
        TestUtils.Simulate.click(deleteCategoryLinkLabel);
        assert.isDefined(categoryNavigationHeaderComponent.refs.confirmPopup);
        assert.strictEqual(categoryNavigationHeaderComponent.refs.confirmPopup.props.description, "Category will be permanently deleted. You will not get feeds from this category.");
        TestUtils.Simulate.click(categoryNavigationHeaderComponent.refs.confirmPopup.refs.cancelButton);
        confirmMock.verify();
        assert.isFalse(deleteCategoryStub.called);
        CategoryDb.deleteCategory.restore();
    });

});
