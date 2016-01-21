/* eslint no-unused-expressions:0, max-nested-callbacks: [2, 5] */
"use strict";
import { AllCategories } from "../../../src/js/config/components/AllCategories.jsx";
import { assert } from "chai";
import React from "react";
import ReactDOM from "react-dom";
import TestUtils from "react-addons-test-utils";
import "../../helper/TestHelper.js";
import mockStore from "../../helper/ActionHelper.js";

describe("All categories", ()=> {

    let allCategories = null, categories = null, allCategoriesPageStrings = null;
    before("All categories", ()=> {
        categories = {
            "categories": [
                { "_id": "id1",
                  "name": "Default"
                },
                { "_id": "id2",
                  "name": "Category A"
                }
            ]
        };

        allCategoriesPageStrings = {
            "allCategoriesHeading": "All Categories Test",
            "addNewCategoryLabel": "Add new category Test"
        };

        allCategories = TestUtils.renderIntoDocument(
            <AllCategories allCategories={categories} allCategoriesPageStrings = {allCategoriesPageStrings} dispatch={()=>{}}/>
        );
    });

    it("should have create-new category option", ()=> {
        assert.isDefined(allCategories.refs.addNewCategoryLink);
    });

    it("should have categories based on props input", ()=> {
        let categoryDOMList = ReactDOM.findDOMNode(allCategories).querySelectorAll("ul li.category");
        assert.strictEqual(2, categoryDOMList.length);
    });

    it("should have category name in the list", ()=> {
        let categoryText = ReactDOM.findDOMNode(allCategories).querySelectorAll("ul li.category span")[1].textContent;
        assert.strictEqual("Category A", categoryText);
    });

    it("should have categories link to /configure/category/ with their id and name", () => {
        assert.strictEqual("/configure/category/id1/Default", allCategories.refs.categoryLink_id1.props.to);
        assert.strictEqual("/configure/category/id2/Category A", allCategories.refs.categoryLink_id2.props.to);
    });

    it("should have all the categories displayed", () => {
        assert.strictEqual("Default", allCategories.refs.category_id1.innerHTML);
        assert.strictEqual("Category A", allCategories.refs.category_id2.innerHTML);
    });

    it("should display the add new category label from the language file", () => {
        assert.strictEqual(allCategoriesPageStrings.addNewCategoryLabel, allCategories.refs.addNewCategoryLink.innerHTML);
    });

    it("should display the all categories label from the language file", () => {
        assert.strictEqual(allCategoriesPageStrings.allCategoriesHeading, allCategories.refs.allCategoriesHeading.innerHTML);
    });
});

describe("All categories componentWillMount", () => {
    xit("should highLightTabAction on component mount", (done) => {

        let allCategoriesPageStrings = {
            "allCategoriesHeading": "All Categories Test",
            "addNewCategoryLabel": "Add new category Test"
        };
        let categories = {
            "categories": [
                { "_id": "id1",
                    "name": "Default"
                },
                { "_id": "id2",
                    "name": "Category A"
                }
            ]
        };
        let tabNames = ["Configure", "RSS"];

        const expectedActions = [{ "type": "CHANGE_HIGHLIGHTED_TAB", "tabNames": tabNames }];
        const store = mockStore({}, expectedActions, done);
        let dispatch = store.dispatch;
        TestUtils.renderIntoDocument(
            <AllCategories allCategories={categories} allCategoriesPageStrings = {allCategoriesPageStrings} dispatch={dispatch}/>
        );
    });
});
