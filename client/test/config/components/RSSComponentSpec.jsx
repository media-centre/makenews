import RSSComponent from "../../../src/js/config/components/RSSComponent";
import { assert } from "chai";
import sinon from "sinon";
import TestUtils from "react-addons-test-utils";
import React from "react";


describe("Rss Component", () => {

    let content = null, categoryDetailsPageStrings = null;
    let rssComponent = null;

    before("rss Component", () => {
        content = [];
        categoryDetailsPageStrings = {
            "hintMessages": {
                "RSSHintMessage": "rss hint"
            },
            "exampleMessages": {
                "RSSExampleURL": "rss example url"
            }
        };
        rssComponent = TestUtils.renderIntoDocument(
            <RSSComponent content={content} categoryDetailsPageStrings={categoryDetailsPageStrings} dispatch={() => { }}/>
        );
    });


    it("should have RSSHintMessage ", () => {
        let rssComponentDOM = rssComponent.props.categoryDetailsPageStrings.hintMessages.RSSHintMessage;
        assert.strictEqual("rss hint", rssComponentDOM);
    });

    it("should have RSSExampleUrl ", () => {
        let rssComponentDOM = rssComponent.props.categoryDetailsPageStrings.exampleMessages.RSSExampleURL;
        assert.strictEqual("rss example url", rssComponentDOM);

    });
    it("should call dispath function in validate  ", () => {

        let fun = () => { };
        fun = sinon.spy();
        let props =
            { "content": [],
                "categoryDetailsPageStrings": {
                    "hintMessages": { "RSSHintMessage": "hint message" },
                    "exampleMessages": { "RSSExampleURL": "example message" }
                },
                "dispatch": fun };
        
        let newob = new RSSComponent(props);
        newob._validateUrl("https://thehindu.com", fun, props);
        assert.isTrue(fun.called);
    });
});
