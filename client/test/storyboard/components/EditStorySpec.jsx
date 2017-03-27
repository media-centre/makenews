import { EditStory } from "../../../src/js/storyboard/components/EditStory";
import TestUtils, { renderIntoDocument } from "react-addons-test-utils";
import { shallow } from "enzyme";
import React from "react";
import ReactQuill from "react-quill";
import DisplayFeeds from "./../../../src/js/newsboard/components/DisplayFeeds";
import NewsBoardTabs from "./../../../src/js/newsboard/components/NewsBoardTabs";
import { assert } from "chai";
import { findAllWithType, findWithClass } from "react-shallow-testutils";
import sinon from "sinon";
import JsPdf from "jspdf";
import FileSaver from "file-saver";

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

    it("should have export icon", () => {
        let source = findWithClass(renderedOutput, "fa fa-share export-icon");

        assert.isDefined(source);
    });

    it("should have export options", () => {
        let source = findWithClass(renderedOutput, "export-options");
        let exportOptions = renderIntoDocument(source);

        assert.strictEqual(exportOptions.style.display, "");
    });

    it("should save the story in pdf format", () => {
        const jsPdf = new JsPdf();
        const store = {
            "getState": () => {
                return {
                    "untitledIndex": "untitled1"
                };
            }
        };
        const position = 15;
        const wrapper = shallow(
            <EditStory story={story} dispatch={() => {}} store = {store}/>
        );
        wrapper.setState({ "title": "new title", "body": "body of the article" });
        const options = wrapper.find(".export-as-pdf");

        const jsPdfInstanceMock = sandbox.mock(EditStory).expects("jsPdfInstance").returns(jsPdf);
        const fromHtmlMock = sandbox.mock(jsPdf).expects("fromHTML")
            .withExactArgs("<html><body><h1>new title</h1>body of the article</body></html>", position, position);
        const saveMock = sandbox.mock(jsPdf).expects("save").withExactArgs("new title.pdf");

        options.simulate("click");

        jsPdfInstanceMock.verify();
        fromHtmlMock.verify();
        saveMock.verify();
    });

    it("should save the story in odt format", () => {
        const jsPdf = new JsPdf();
        const store = {
            "getState": () => {
                return {
                    "untitledIndex": "untitled1"
                };
            }
        };
        const position = 15;
        const wrapper = shallow(
            <EditStory story={story} dispatch={() => {}} store={store}/>
        );
        wrapper.setState({ "title": "new title", "body": "body of the article" });
        const options = wrapper.find(".export-as-odt");

        const jsPdfInstanceMock = sandbox.mock(EditStory).expects("jsPdfInstance").returns(jsPdf);
        const fromHtmlMock = sandbox.mock(jsPdf).expects("fromHTML")
            .withExactArgs("<html><body><h1>new title</h1>body of the article</body></html>", position, position);
        const saveMock = sandbox.mock(jsPdf).expects("save").withExactArgs("new title.odt");

        options.simulate("click");

        jsPdfInstanceMock.verify();
        fromHtmlMock.verify();
        saveMock.verify();
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
            <EditStory story={story} dispatch={() => {}} store={store}/>
        );
        wrapper.setState({ "title": "new title", "body": "body of the article" });
        const options = wrapper.find(".export-as-html");

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
