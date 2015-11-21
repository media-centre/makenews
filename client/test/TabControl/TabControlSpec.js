/* eslint no-magic-numbers:0 no-unused-expressions:0, max-nested-callbacks: [2, 5] */
"use strict";
import "../helper/TestHelper.js";
import TabControl from "../../src/js/config/components/TabControl/TabControl.jsx";
import TabContent from "../../src/js/config/components/TabControl/TabContent.jsx";
import { assert } from "chai";
import ReactDOM from "react-dom";
import React from "react/addons";
import "../helper/TestHelper.js";

let TestUtils = React.addons.TestUtils, content = {};

describe("Tab Control", ()=> {
    before(() => {
        content = {
            "details": [{ "_id": "id1", "url": "one detail" }],
            "name": "one"
        };
    });
    xit("should have at least one child", ()=> {

        function iThrowError() {
            throw new Error("Error thrown");
        }

        TestUtils.renderIntoDocument(
            <TabControl />
        );
        assert.throws(iThrowError, Error, "Error thrown");
    });

    it("should have atleast one TabContent", ()=> {
        let TabControlComponent = TestUtils.renderIntoDocument(
            <TabControl>
                <TabContent title={content.name} content={content} categoryName={content.name}/>
            </TabControl>
        );
        assert.strictEqual(TabControlComponent.props.children.props.title, "one");
    });

    it("can have multiple TabContents", ()=> {
        let TabControlComponent = TestUtils.renderIntoDocument(
            <TabControl>
                <TabContent title={content.name} content={content.details}/>
                <TabContent title={content.name} content={content.details}/>
            </TabControl>
        );

        assert.strictEqual(TabControlComponent.props.children.length > 1, true);
    });

    it("should tab header and content", ()=> {

        let TabControlComponent = TestUtils.renderIntoDocument(
            <TabControl>
                <TabContent title={content.name} content={content.details}/>
                <TabContent title={content.name} content={content.details}/>
            </TabControl>
        );
        let tabHeader = ReactDOM.findDOMNode(TabControlComponent).querySelector(".tab");
        let tabContent = ReactDOM.findDOMNode(TabControlComponent).querySelector(".tab-content-inner");
        assert.isNotNull(tabHeader);
        assert.isNotNull(tabContent);
    });

    it("should be selected the first tab by default", ()=> {

        let TabControlComponent = TestUtils.renderIntoDocument(
            <TabControl>
                <TabContent title={content.name} content={content.details}/>
                <TabContent title={content.name} content={content.details}/>
            </TabControl>
        );
        let userNameInputDOM = ReactDOM.findDOMNode(TabControlComponent).querySelector(".tab");
        assert.strictEqual(userNameInputDOM.classList.contains("selected"), true);
    });

    xit("should display corresponding contents on clicking tabs", ()=> {
        let TabControlComponent = TestUtils.renderIntoDocument(
            <TabControl>
                <TabContent title={content.name} content={content.details}/>
                <TabContent title={content.name} content={content.details}/>
            </TabControl>
        );

        let userNameInputDOM = ReactDOM.findDOMNode(TabControlComponent.refs.tab1);
        TestUtils.Simulate.keyUp(userNameInputDOM);

        setTimeout(()=> {
            let contentDom = ReactDOM.findDOMNode(TabControlComponent.refs.tabContent1);
            assert.strictEqual("1", contentDom.getDOMNode().getAttribute("data-selected"));
        }, 50);
    });
});
