import { WriteStory } from "../../../src/js/storyboard/components/WriteStory";
import TestUtils from "react-addons-test-utils";
import React from "react";
import ReactDOM from "react-dom";
import { assert } from "chai";
import sinon from "sinon";
import AjaxClient from "../../../src/js/utils/AjaxClient";
import Toast from "../../../src/js/utils/custom_templates/Toast";

describe("WriteStory", () => {
    let writeStory = null, sandbox = null, location = null;
    const headers = {
        "Accept": "application/json",
        "Content-Type": "application/json"
    };
    beforeEach("WriteStory", () => {
        sandbox = sinon.sandbox.create();
        location = { "pathname": "/storyBoard/story", "search": "?storyId=id1" };
    });

    afterEach("WriteStory", () => {
        sandbox.restore();
    });

    it("should be present", () => {
        writeStory = TestUtils.renderIntoDocument(
            <WriteStory location={location} dispatch={() => {}}/>
        );
        assert.isDefined(writeStory, "Defined");
    });

    it("should call addTitle function onclick save button", () => {
        writeStory = TestUtils.renderIntoDocument(
            <WriteStory location={location} dispatch={() => {}}/>
        );
        let response = { "ok": true, "_id": "1234", "_rev": "1234" };

        let ajaxClientInstance = AjaxClient.instance("/add-story");
        let ajaxClientMock = sandbox.mock(AjaxClient).expects("instance")
            .withExactArgs("/add-story").returns(ajaxClientInstance);
        let putMock = sandbox.mock(ajaxClientInstance).expects("put")
            .withExactArgs(headers, { "title": "title" }).returns(Promise.resolve(response));

        let storyCardDom = ReactDOM.findDOMNode(writeStory);
        let input = writeStory.refs.title;
        input.value = "title";
        writeStory.story = { "title": input.value };
        TestUtils.Simulate.click(storyCardDom.querySelector(".save-box"));
        ajaxClientMock.verify();
        putMock.verify();
    });

    it("should call addTitle function on clicking ENTER", () => {
        writeStory = TestUtils.renderIntoDocument(
            <WriteStory location={location} dispatch={() => {}}/>
        );
        let response = { "ok": true, "_id": "1234", "_rev": "1234" };
        let ajaxClientInstance = AjaxClient.instance("/add-story");
        let ajaxClientMock = sandbox.mock(AjaxClient).expects("instance")
            .withExactArgs("/add-story").returns(ajaxClientInstance);
        let putMock = sandbox.mock(ajaxClientInstance).expects("put")
            .withExactArgs(headers, { "title": "title" }).returns(Promise.resolve(response));
        let storyCardDom = ReactDOM.findDOMNode(writeStory);
        let inputBox = storyCardDom.querySelector(".title-box");
        inputBox.value = "title";
        writeStory.story = { "title": inputBox.value };
        TestUtils.Simulate.keyDown(inputBox, { "keyCode": 13 });
        ajaxClientMock.verify();
        putMock.verify();
    });

    it("should call addTitle function on clicking ENTER but it should display error message if adding gives an error", () => {
        let ajaxClientInstance = AjaxClient.instance("/add-story");
        let ajaxClientMock = sandbox.mock(AjaxClient)
            .expects("instance").twice().returns(ajaxClientInstance);
        let postMock = sandbox.mock(ajaxClientInstance).expects("put")
            .withExactArgs(headers, { "title": "title" }).returns(Promise.reject("error"));

        sandbox.mock(ajaxClientInstance).expects("get")
            .returns(Promise.resolve({ "title": "title" }));

        let toastShowMock = sandbox.mock(Toast).expects("show");
        toastShowMock.withArgs("EITHER you entered/saved title more than once OR Story title already exists.");

        writeStory = TestUtils.renderIntoDocument(
            <WriteStory location={location} dispatch={() => {}}/>
        );

        let storyCardDom = ReactDOM.findDOMNode(writeStory);
        let inputBox = storyCardDom.querySelector(".title-box");
        inputBox.value = "title";
        writeStory.story = { "title": inputBox.value };

        TestUtils.Simulate.keyDown(inputBox, { "keyCode": 13 });
        setTimeout(()=> {
            toastShowMock.verify();
        });
        ajaxClientMock.verify();
        postMock.verify();
    });

    it("should not add title if they click on the key other than ENTER", () => {
        writeStory = TestUtils.renderIntoDocument(
            <WriteStory location={location} dispatch={() => {}}/>
        );
        let response = { "ok": true, "_id": "1234", "_rev": "1234" };
        let ajaxClientInstance = AjaxClient.instance("/add-story");
        let ajaxClientMock = sandbox.mock(AjaxClient).expects("instance")
            .returns(ajaxClientInstance).never();
        let postMock = sandbox.mock(ajaxClientInstance).expects("post").returns(Promise.resolve(response)).never();
        let storyCardDom = ReactDOM.findDOMNode(writeStory);
        let inputBox = storyCardDom.querySelector(".title-box");
        inputBox.value = "title";
        writeStory.story = { "title": inputBox.value };
        TestUtils.Simulate.keyDown(inputBox, { "keyCode": 12 });
        ajaxClientMock.verify();
        postMock.verify();
    });

    it("should call the getstory when component rendered", () => {
        let response = { "_id": "id", "title": "title", "_rev": "rev" };
        let ajaxClientInstance = AjaxClient.instance("/story");
        let ajaxClientMock = sandbox.mock(AjaxClient).expects("instance")
            .returns(ajaxClientInstance);
        let getMock = sandbox.mock(ajaxClientInstance).expects("get").returns(Promise.resolve(response));
        location = { "search": "?storyId=id1" };
        writeStory = TestUtils.renderIntoDocument(
            <WriteStory location={location} />
        );
        ajaxClientMock.verify();
        getMock.verify();
    });
});

