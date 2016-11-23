/* eslint max-nested-callbacks:0 */

import SourceTypeFilter from "../../../src/js/surf/components/SourceTypeFilter"; //eslint-disable-line no-unused-vars

import { assert } from "chai";
import TestUtils from "react-addons-test-utils";
import React from "react";
import ReactDOM from "react-dom";
import "../../helper/TestHelper";

let filter = null;
describe("SourceTypeFilter", ()=> {

    beforeEach("before", ()=> {
        filter = {
            "categories": [],
            "mediaTypes": [],
            "sourceTypes": [{
                "name": "Rss",
                "_id": "rss"
            },
            {
                "name": "Twitter",
                "_id": "twitter"
            }]
        };
    });

    describe("SourceTypeFilter", ()=> {
        it("should have filter and dispatcher", ()=> {
            let dispatchFilterAction = ()=> {};
            let sourceTypeFilter = TestUtils.renderIntoDocument(
                <SourceTypeFilter filter={filter} dispatchFilterAction={dispatchFilterAction}/>
            );
            assert.isDefined(sourceTypeFilter, "defined");
            assert.deepEqual(filter, sourceTypeFilter.props.filter);
        });

        it("should highlight the selected sourceTypes", ()=> {
            let dispatchFilterAction = ()=> {};
            let sourceTypeFilter = TestUtils.renderIntoDocument(
                <SourceTypeFilter filter={filter} dispatchFilterAction={dispatchFilterAction}/>
            );
            let filterDom = ReactDOM.findDOMNode(sourceTypeFilter);
            let selectedItems = filterDom.querySelectorAll("ul.source-type-list li.selected");
            assert.strictEqual("Rss", selectedItems[0].textContent); //eslint-disable-line no-magic-numbers
            assert.strictEqual("Twitter", selectedItems[1].textContent); //eslint-disable-line no-magic-numbers
        });

        it("should toggle the section on clicking the items", ()=> {

            let dispatchFilterAction = ()=> {};
            let sourceTypeFilter = TestUtils.renderIntoDocument(
                <SourceTypeFilter filter={filter} dispatchFilterAction={dispatchFilterAction}/>
            );
            let filterDom = ReactDOM.findDOMNode(sourceTypeFilter);
            let items = filterDom.querySelectorAll("ul.source-type-list li");
            TestUtils.Simulate.click(items[0]); //eslint-disable-line no-magic-numbers
            assert.isFalse(items[1].classList.contains("selected")); //eslint-disable-line no-magic-numbers
        });

        it("should update the feeds on clicking the items", ()=> {

            let result = {
                "categories": [],
                "mediaTypes": [],
                "sourceTypes": [{ "name": "Twitter", "_id": "twitter" }]
            };

            let dispatchFilterAction = (filterResponse)=> {
                assert.deepEqual(result, filterResponse);
            };

            let sourceTypeFilter = TestUtils.renderIntoDocument(
                <SourceTypeFilter filter={filter} dispatchFilterAction={dispatchFilterAction}/>
            );
            let filterDom = ReactDOM.findDOMNode(sourceTypeFilter);
            let items = filterDom.querySelectorAll("ul.source-type-list li");
            TestUtils.Simulate.click(items[0]); //eslint-disable-line no-magic-numbers
        });
    });
});
