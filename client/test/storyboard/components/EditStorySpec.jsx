import EditStory from "../../../src/js/storyboard/components/EditStory";
import StoryEditor from "../../../src/js/storyboard/components/StoryEditor";
import TestUtils from "react-addons-test-utils";
import React from "react";
import { assert } from "chai";
import { findAllWithType } from "react-shallow-testutils";

describe("EditStory", () => {
    let renderer = null, renderedOutput = null;

    beforeEach("EditStory", () => {
        renderer = TestUtils.createRenderer();
        renderer.render(<EditStory />);
        renderedOutput = renderer.getRenderOutput();
    });

    it("should have story board class", () => {
        assert.equal(renderedOutput.props.className, "story-board");
    });

    it("should have StoryEditor element", () => {
        let storyEditor = findAllWithType(renderedOutput, StoryEditor);
        assert.equal(storyEditor.length, 1);  //eslint-disable-line no-magic-numbers
    });
});
