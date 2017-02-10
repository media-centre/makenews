import { EditStory } from "../../../src/js/storyboard/components/EditStory";
import TestUtils from "react-addons-test-utils";
import React from "react";
import ReactQuill from "react-quill";
import { assert } from "chai";
import { findAllWithType } from "react-shallow-testutils";
import sinon from "sinon";

describe("EditStory", () => {
    let renderer = null, sandbox = null, renderedOutput = null,
        story = { "_id": "id", "_rev": "rev", "title": "title", "body": "body" };

    beforeEach("EditStory", () => {
        sandbox = sinon.sandbox.create();
        renderer = TestUtils.createRenderer();
        renderer.render(<EditStory story={story} dispatch={() => {}}/>);
        renderedOutput = renderer.getRenderOutput();
    });

    afterEach("EditStory", () => {
        sandbox.restore();
    });

    it("should have story board class", () => {
        assert.equal(renderedOutput.props.className, "story-board");
    });

    it("should have div with editor-container", () => {
        assert.equal(renderedOutput.props.children[1].props.className, "editor-container"); //eslint-disable-line no-magic-numbers
    });

    it("should have input element with story-title as class", () => {
        let inputElement = renderedOutput.props.children[1].props.children[0].props.className; //eslint-disable-line no-magic-numbers
        assert.equal(inputElement, "story-title");
    });

    it("should have button element with story-save as class", () => {
        let inputElement = renderedOutput.props.children[1].props.children[1].props.className; //eslint-disable-line no-magic-numbers
        assert.equal(inputElement, "story-save");
    });

    it("should have React quill element", () => {
        let storyEditor = findAllWithType(renderedOutput, ReactQuill);
        assert.equal(storyEditor.length, 1);  //eslint-disable-line no-magic-numbers
    });

});
