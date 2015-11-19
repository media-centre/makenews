/* eslint no-unused-expressions:0, max-nested-callbacks: [2, 5] */


"use strict";
import "../helper/TestHelper.js";
import { assert } from "chai";
import sinon from "sinon";
import ReactDOM from "react-dom";
import React from "react/addons";
import jsdom from "jsdom";
import {AllCategories} from "../../src/js/config/components/AllCategories.jsx";
import "../helper/TestHelper.js";

let TestUtils = React.addons.TestUtils, categories = [], allCategories = null;

describe("All categories", ()=> {

    before("render and locate element", ()=> {
        if(allCategories) {
            allCategories = null;
            categories = [];
        }
        categories = ["Default", "Category A"];
        allCategories = TestUtils.renderIntoDocument(
            <AllCategories categories={categories} dispatch={()=>{}}/>
        );
    });

    it("should have create-new category option", ()=> {
        let createCategoryDOM = ReactDOM.findDOMNode(allCategories).querySelector('ul li.add-new');
        assert.isNotNull(createCategoryDOM);
    });

    it("should have categories based on props input", ()=> {
        let categoryDOMList = ReactDOM.findDOMNode(allCategories).querySelectorAll('ul li.category');
        assert.strictEqual(2, categoryDOMList.length);
    });

    it("should have category name in the list", ()=> {
        let categoryText = ReactDOM.findDOMNode(allCategories).querySelectorAll('ul li.category span')[1].textContent;
        assert.strictEqual("Category A", categoryText);
    });

});
