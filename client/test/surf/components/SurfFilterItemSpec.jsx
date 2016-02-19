/* eslint max-nested-callbacks:0 */

"use strict";
import SurfFilterItem from "../../../src/js/surf/components/SurfFilterItem.jsx"; //eslint-disable-line no-unused-vars

import { assert } from "chai";
import TestUtils from "react-addons-test-utils";
import React from "react";
import ReactDOM from "react-dom";
import "../../helper/TestHelper.js";

describe("SurfFilterItem Component", ()=> {
    describe("Category Filter", ()=> {
        it("should be present", ()=> {
            let surfFilterItem = TestUtils.renderIntoDocument(
                <SurfFilterItem type="text" displayItems={[]} filterItems={[]} title="Content" dispatchFilterAction={()=> {}}/>
            );
            assert.isDefined(surfFilterItem, "defined");
        });
        it("should display all the category options", ()=> {
            let categories = [
                {
                    "_id": "12345",
                    "name": "Category 1"
                }, {
                    "_id": "23489",
                    "name": "Category 2"
                }
            ];
            let surfFilterItem = TestUtils.renderIntoDocument(
                <SurfFilterItem type="text" displayItems={categories} filterItems={[]} title="category" dispatchFilterAction={()=> {}}/>
            );
            let surfFilterItemDom = ReactDOM.findDOMNode(surfFilterItem);
            assert.strictEqual(2, surfFilterItemDom.querySelectorAll("li").length);
        });
        it("should display category text as a list", ()=> {
            let categories = [
                {
                    "_id": "12345",
                    "name": "Category 1"
                }, {
                    "_id": "23489",
                    "name": "Category 2"
                }
            ];
            let surfFilterItem = TestUtils.renderIntoDocument(
                <SurfFilterItem type="text" displayItems={categories} filterItems={[]} title="image" dispatchFilterAction={()=> {}}/>
            );
            let surfFilterItemDom = ReactDOM.findDOMNode(surfFilterItem);
            assert.strictEqual("Category 1", surfFilterItemDom.querySelector("li").innerHTML);
        });

        it("should display content types with image and text as a list", ()=> {
            let categories = [
                {
                    "name": "Text",
                    "image": "text"
                }, {
                    "name": "Pictures",
                    "image": "picture"
                }, {
                    "name": "Videos",
                    "image": "video"
                }
            ];
            let surfFilterItem = TestUtils.renderIntoDocument(
                <SurfFilterItem type="content" displayItems={categories} filterItems={[]} title="image" dispatchFilterAction={()=> {}}/>
            );
            let surfFilterItemDom = ReactDOM.findDOMNode(surfFilterItem);
            assert.strictEqual("image fa fa-text", surfFilterItemDom.querySelector(".image").className);
        });

        it("should dispatch filter action on click", ()=> {
            let content = [
                {
                    "name": "Text",
                    "image": "text"
                }, {
                    "name": "Pictures",
                    "image": "picture"
                }, {
                    "name": "Videos",
                    "image": "video"
                }
            ];

            let dispatchFilterActionMethod = function(type, items) {
                assert.deepEqual([{ "name": "Text", "image": "text" }], items);
                assert.strictEqual("content", type);
            };

            let surfFilterItem = TestUtils.renderIntoDocument(
                <SurfFilterItem type="content" displayItems={content} filterItems={[]} title="image" dispatchFilterAction={dispatchFilterActionMethod}/>
            );
            let surfFilterItemDom = ReactDOM.findDOMNode(surfFilterItem);
            TestUtils.Simulate.click(surfFilterItemDom.querySelector("li"));
        });

        it("should have mandatory properties displayItems and filterItems", ()=> {
            let displayItems = [
                {
                    "name": "Text",
                    "image": "text"
                }, {
                    "name": "Pictures",
                    "image": "picture"
                }, {
                    "name": "Videos",
                    "image": "video"
                }
            ];
            let filterItems = ["Text", "Videos"];

            let surfFilterItem = TestUtils.renderIntoDocument(
                <SurfFilterItem type="content" displayItems={displayItems} filterItems={filterItems} title="image" dispatchFilterAction={()=> {}}/>
            );
            assert.strictEqual(displayItems.length, surfFilterItem.props.displayItems.length);
            assert.strictEqual(filterItems.length, surfFilterItem.props.filterItems.length);
        });

        it("should highlight the filtered items on opening the filter", ()=> {
            let displayItems = [
                {
                    "name": "Text",
                    "image": "file-text-o",
                    "_id": "Text"
                }, {
                    "name": "Pictures",
                    "image": "file-picture-o",
                    "_id": "Pictures"
                }, {
                    "name": "Videos",
                    "image": "play-circle-o",
                    "_id": "Videos"
                }
            ];
            let filterItems = [{ "_id": "Text" }, { "_id": "Videos" }];

            let surfFilterItem = TestUtils.renderIntoDocument(
                <SurfFilterItem type="content" displayItems={displayItems} filterItems={filterItems} title="image" dispatchFilterAction={()=> {}}/>
            );
            let surfFilterItemDom = ReactDOM.findDOMNode(surfFilterItem);
            let filterDomElements = surfFilterItemDom.querySelectorAll("ul li.selected .content-type");
            assert.strictEqual("Text", filterDomElements[0].textContent);
            assert.strictEqual("Videos", filterDomElements[1].textContent);

        });

        it("should enable or disable items on click", ()=> {
            let displayItems = [
                {
                    "name": "Text",
                    "image": "file-text-o",
                    "_id": "Text"
                }, {
                    "name": "Pictures",
                    "image": "file-picture-o",
                    "_id": "Pictures"
                }, {
                    "name": "Videos",
                    "image": "play-circle-o",
                    "_id": "Videos"
                }
            ];
            let filterItems = [{ "_id": "Text" }, { "_id": "Videos" }];

            let surfFilterItem = TestUtils.renderIntoDocument(
                <SurfFilterItem type="content" displayItems={displayItems} filterItems={filterItems} title="image" dispatchFilterAction={()=> {}}/>
            );
            let surfFilterItemDom = ReactDOM.findDOMNode(surfFilterItem);
            let filterDomElements = surfFilterItemDom.querySelectorAll("ul li.selected");
            TestUtils.Simulate.click(filterDomElements[1]);
            assert.isUndefined(surfFilterItem.props.filterItems[2]);

        });
    });
});
