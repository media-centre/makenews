import StoryEditor from "../../../src/js/storyboard/components/StoryEditor";
import React from "react";
import TestUtils from "react-addons-test-utils";
import { findAllWithType } from "react-shallow-testutils";
import { assert } from "chai";
import ReactQuill from "react-quill";

describe("StoryEditor", () => {
    let renderer = null, renderedOutput = null;

    beforeEach("StoryEditor", () => {
        renderer = TestUtils.createRenderer();
        renderer.render(<StoryEditor />);
        renderedOutput = renderer.getRenderOutput();
    });

    it("should have react quill element with story-editor-container class", () => {
        let quill = findAllWithType(renderedOutput, ReactQuill);
        assert.equal(quill.length, 1); //eslint-disable-line no-magic-numbers
        assert.strictEqual(quill[0].props.className, "story-editor-container"); //eslint-disable-line no-magic-numbers
    });
});
