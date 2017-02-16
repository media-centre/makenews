import { EditStory } from "../../../src/js/storyboard/components/EditStory";
import TestUtils from "react-addons-test-utils";
import React from "react";
import ReactQuill from "react-quill";
import DisplayFeeds from "./../../../src/js/newsboard/components/DisplayFeeds";
import NewsBoardTabs from "./../../../src/js/newsboard/components/NewsBoardTabs";
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
        assert.equal(renderedOutput.props.className, "story-board story-collections");
    });

    it("should have div with editor-container with three children", () => {
        let [editor] = renderedOutput.props.children;

        assert.equal(editor.props.className, "editor-container");
        assert.equal(renderedOutput.props.children.length, 3); //eslint-disable-line no-magic-numbers
    });

    it("should have input element with story-title as class", () => {
        let [editor] = renderedOutput.props.children;
        let [inputElement] = editor.props.children;

        assert.equal(inputElement.ref, "title");
        assert.equal(inputElement.props.className, "story-title");
        assert.equal(inputElement.props.placeholder, "please enter title");
        assert.equal(inputElement.props.value, "");
    });

    it("should have button element with story-save as class", () => {
        let [editor] = renderedOutput.props.children;
        let [, button] = editor.props.children;

        assert.equal(button.type, "button");
        assert.equal(button.ref, "saveButton");
        assert.equal(button.props.type, "submit");
        assert.equal(button.props.value, "save");
    });

    it("should have React quill element", () => {
        let source = findAllWithType(renderedOutput, ReactQuill);
        let [storyEditor] = source;
        assert.isDefined(storyEditor);

    });

    it("should have Display feeds component", () => {
        let source = findAllWithType(renderedOutput, DisplayFeeds);
        let [displayFeeds] = source;
        assert.isDefined(displayFeeds);
    });

    it("should have tabs component", () => {
        let source = findAllWithType(renderedOutput, NewsBoardTabs);
        let [tabs] = source;
        assert.isDefined(tabs);
    });

});
