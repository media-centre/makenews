import { DisplayStoryCollection } from "../../../src/js/storyboard/components/DisplayStoryCollection";
import React from "react";
import TestUtils from "react-addons-test-utils";
import { findAllWithType } from "react-shallow-testutils";
import { assert } from "chai";
import DisplayCollectionFeeds from "./../../../src/js/newsboard/components/DisplayCollectionFeeds";


describe("Display story collection", () => {
    let feeds = null, result = null, renderedOutput = null;

    beforeEach("Display Collection", () => {
        feeds = [
            { "_id": "1234", "collection": "collection1" }
        ];

        result = TestUtils.createRenderer();
        result.render(<DisplayStoryCollection collectionNames={feeds} dispatch={() => {}}/>);
        renderedOutput = result.getRenderOutput();
    });

    it("should render collections when the souretype is collection", () => {
        assert(renderedOutput.props.className, "configured-feeds-container");
    });

    xit("should render DisplaycollectionFeeds when we click on collection", () =>{
        let collectionElement = findAllWithType(renderedOutput, DisplayCollectionFeeds);
        let [feed] = collectionElement;
        assert.isDefined(feed);
    });
});
