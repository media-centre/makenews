import EditStory from "../../../src/js/storyboard/components/EditStory";
import TestUtils from "react-addons-test-utils";
import { shallow } from "enzyme";
import React from "react";
import ReactQuill from "react-quill";
import DisplayFeeds from "./../../../src/js/newsboard/components/DisplayFeeds";
import NewsBoardTabs from "./../../../src/js/newsboard/components/NewsBoardTabs";
import { assert } from "chai";
import { findAllWithType, findWithClass } from "react-shallow-testutils";
import sinon from "sinon";
import FileSaver from "file-saver";
import Locale from "./../../../src/js/utils/Locale";

describe("EditStory", () => {
    let renderer = null, sandbox = null, renderedOutput = null,
        story = { "_id": "id", "_rev": "rev", "title": "title", "body": "body" };
    const anonymousFun = () => {};

    beforeEach("EditStory", () => {
        sandbox = sinon.sandbox.create();
        const storyBoardMessages = {
            "createStory": "Create New Story",
            "untitledStory": "Untitled",
            "backButton": "Back",
            "saveButton": "SAVE",
            "confirmDelete": "Are you sure you want to delete the story?",
            "confirmStoryBack": "All the unsaved changes will be removed. Are you sure you want to go back?",
            "successMessages": {
                "saveStory": "Story saved successfully",
                "deleteStory": "Story deleted successfully"
            },
            "warningMessages": {
                "emptyStory": "Cannot save empty story"
            },
            "errorMessages": {
                "saveStoryFailure": "Not able to save"
            }
        };
        sandbox.stub(Locale, "applicationStrings").returns({
            "messages": {
                "storyBoard": storyBoardMessages
            }
        });
        renderer = TestUtils.createRenderer();
        renderer.render(<EditStory story={story} />);
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

    it("should have button element with back as class", () => {
        let [editor] = renderedOutput.props.children;
        let [toolbar] = editor.props.children;
        let [button] = toolbar.props.children;

        assert.equal(toolbar.props.className, "editor-toolbar");
        assert.equal(button.type, "button");
        assert.equal(button.props.className, "back");
        assert.equal(button.props.children, "Back");
    });

    it("should have button element with save as class", () => {
        let [editor] = renderedOutput.props.children;
        let [toolbar] = editor.props.children;
        let [, , button] = toolbar.props.children;

        assert.equal(button.type, "button");
        assert.equal(button.ref, "saveButton");
        assert.equal(button.props.type, "submit");
        assert.equal(button.props.value, "save");
    });

    it("should have input element with story-title as class", () => {
        let [editor] = renderedOutput.props.children;
        let [, inputContainer] = editor.props.children;
        const inputElement = inputContainer.props.children;


        assert.equal(inputContainer.props.className, "title-bar");
        assert.equal(inputElement.ref, "title");
        assert.equal(inputElement.props.className, "story-title");
        assert.equal(inputElement.props.placeholder, "please enter title");
        assert.equal(inputElement.props.value, "");
    });

    it("should have React quill element", () => {
        let source = findAllWithType(renderedOutput, ReactQuill);
        let [storyEditor] = source;

        assert.isDefined(storyEditor);
    });

    it("should have export icon", () => {
        let source = findWithClass(renderedOutput, "fa fa-share export-icon");

        assert.isDefined(source);
    });

    it("should save the story in html format", () => {
        const store = {
            "getState": () => {
                return {
                    "untitledIndex": "untitled1"
                };
            }
        };
        const wrapper = shallow(
            <EditStory story={story} dispatch={anonymousFun} store={store}/>
        );
        wrapper.setState({ "title": "new title", "body": "body of the article" });
        const options = wrapper.find(".export-icon");

        const blobInstanceMock = sandbox.mock(EditStory).expects("blobInstance").returns({});

        const saveMock = sandbox.mock(FileSaver).expects("saveAs").withExactArgs({}, "new title.html");

        options.simulate("click");

        blobInstanceMock.verify();
        saveMock.verify();
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
