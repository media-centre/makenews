import { NewStoryCard } from "../../../src/js/storyboard/components/NewStoryCard";
import TestUtils from "react-addons-test-utils";
import React from "react";
import ReactDOM from "react-dom";
import { assert } from "chai";
import sinon from "sinon";
import AjaxClient from "../../../src/js/utils/AjaxClient";

describe("NewStoryCard", () => {
    let newStoryCard = null, sandbox = null;
    beforeEach("NewStoryCard", () => {
        let location = { "pathname": "/storyBoard/story", "search": "?storyId=id1" };
        newStoryCard = TestUtils.renderIntoDocument(
            <NewStoryCard location={location} dispatch={() => {}}/>
        );
        sandbox = sinon.sandbox.create();
    });

    afterEach("NewStoryCard", () => {
        sandbox.restore();
    });

    it("should be present", () => {
        assert.isDefined(newStoryCard, "Defined");
    });

    it("should call addTitle function onclick save button", () => {
        let response = { "ok": true, "_id": "1234", "_rev": "1234" };
        let ajaxClientInstance = AjaxClient.instance("/add-story");
        let ajaxClientMock = sandbox.mock(AjaxClient).expects("instance")
            .returns(ajaxClientInstance);
        let postMock = sandbox.mock(ajaxClientInstance).expects("post").returns(Promise.resolve(response));
        let storyCardDom = ReactDOM.findDOMNode(newStoryCard);
        let input = newStoryCard.refs.title;
        input.value = "title";
        newStoryCard.story = { "title": input.value };
        TestUtils.Simulate.click(storyCardDom.querySelector(".save-box"));
        ajaxClientMock.verify();
        postMock.verify();
    });

    it("should call addTitle function on clicking ENTER", () => {
        let response = { "ok": true, "_id": "1234", "_rev": "1234" };
        let ajaxClientInstance = AjaxClient.instance("/add-story");
        let ajaxClientMock = sandbox.mock(AjaxClient).expects("instance")
            .returns(ajaxClientInstance);
        let postMock = sandbox.mock(ajaxClientInstance).expects("post").returns(Promise.resolve(response));
        let storyCardDom = ReactDOM.findDOMNode(newStoryCard);
        let inputBox = storyCardDom.querySelector(".title-box");
        inputBox.value = "title";
        newStoryCard.story = { "title": inputBox.value };
        TestUtils.Simulate.keyDown(inputBox, { "keyCode": 13 });
        ajaxClientMock.verify();
        postMock.verify();
    });

    it("should call addTitle function on clicking ENTER but it should display error message if the post call rejects with error", () => {
        let ajaxClientInstance = AjaxClient.instance("/add-story");
        let ajaxClientMock = sandbox.mock(AjaxClient).expects("instance")
            .returns(ajaxClientInstance);
        let postMock = sandbox.mock(ajaxClientInstance).expects("post").returns(Promise.reject("error"));
        let storyCardDom = ReactDOM.findDOMNode(newStoryCard);
        let inputBox = storyCardDom.querySelector(".title-box");
        inputBox.value = "title";
        newStoryCard.story = { "title": inputBox.value };
        TestUtils.Simulate.keyDown(inputBox, { "keyCode": 13 });
        ajaxClientMock.verify();
        postMock.verify();
    });

    it("should not add title if they click on the key other than ENTER", () => {
        let response = { "ok": true, "_id": "1234", "_rev": "1234" };
        let ajaxClientInstance = AjaxClient.instance("/add-story");
        let ajaxClientMock = sandbox.mock(AjaxClient).expects("instance")
            .returns(ajaxClientInstance).never();
        let postMock = sandbox.mock(ajaxClientInstance).expects("post").returns(Promise.resolve(response)).never();
        let storyCardDom = ReactDOM.findDOMNode(newStoryCard);
        let inputBox = storyCardDom.querySelector(".title-box");
        inputBox.value = "title";
        newStoryCard.story = { "title": inputBox.value };
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
        let location = { "search": "?storyId=id1" };
        newStoryCard = TestUtils.renderIntoDocument(
            <NewStoryCard location={location} />
        );
        ajaxClientMock.verify();
        getMock.verify();
    });
});

