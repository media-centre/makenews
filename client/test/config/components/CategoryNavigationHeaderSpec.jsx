/* eslint no-magic-numbers:0 no-unused-expressions:0, max-nested-callbacks: [2, 5] */
"use strict";
import "../../helper/TestHelper.js";
import CategoryNavigationHeader from "../../../src/js/config/components/CategoryNavigationHeader.jsx";
import CategoryDb from "../../../src/js/config/db/CategoryDb";
import Category from "../../../src/js/config/components/Category.jsx";
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
            <CategoryNavigationHeader updateCategoryName={()=> {}} categoryName="Test Category Name" categoryId="Test Category id" categoryDetailsPageStrings={categoryDetailsPageStrings}/>
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

    it("Should delete category if delete category is called and confirmed", () => {
        const deleteCategoryLinkLabel = categoryNavigationHeaderComponent.refs.deleteCategoryLinkLabel;
        assert.strictEqual(categoryDetailsPageStrings.deleteCategoryLinkLabel, deleteCategoryLinkLabel.innerHTML);
        let deleteCategoryMock = sinon.mock(CategoryDb);
        deleteCategoryMock.expects("deleteCategory").returns(Promise.resolve(true));
        TestUtils.Simulate.click(deleteCategoryLinkLabel);
        assert.isDefined(categoryNavigationHeaderComponent.refs.confirmPopup);
        assert.strictEqual(categoryNavigationHeaderComponent.refs.confirmPopup.props.description, "This category will be deleted  and you will no longer receive feeds from its URLs." +
            " Parked items will remain unaffected. Are you sure you want to continue? ");
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
        assert.strictEqual(categoryNavigationHeaderComponent.refs.confirmPopup.props.description, "This category will be deleted  and you will no longer receive feeds from its URLs." +
            " Parked items will remain unaffected. Are you sure you want to continue? ");
        TestUtils.Simulate.click(categoryNavigationHeaderComponent.refs.confirmPopup.refs.cancelButton);
        confirmMock.verify();
        assert.isFalse(deleteCategoryStub.called);
        CategoryDb.deleteCategory.restore();
    });
    xit("Should  display empty message when category name is not updated", () => {
        const categoryTitleElement = categoryNavigationHeaderComponent.refs.categoryTitleElement;
        TestUtils.Simulate.keyPress(categoryTitleElement, { "key": "Enter", "keyCode": 13, "which": 13 });
        let deleteCategoryMock = sinon.mock(Category);
        deleteCategoryMock.expects("updateCategoryName").returns("hjh");
        assert.strictEqual(categoryNavigationHeaderComponent.refs.errorMessage.innerHTML, "hgjh");
    });

});
