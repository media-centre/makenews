import { StoryCards } from "../../../src/js/storyboard/components/StoryCards";
import TestUtils from "react-addons-test-utils";
import { assert } from "chai";
import React from "react";
import ReactDOM from "react-dom";
import sinon from "sinon";
import Locale from "./../../../src/js/utils/Locale";

describe("StoryCards", () => {
    let storyBoardCards = null, stories = null;
    const sandbox = sinon.sandbox.create();
    const anonymousFun = () => {};

    beforeEach("StoryCards", () => {
        const storyBoardMessages = {
            "createStory": "Create New Story",
            "untitledStory": "Untitled",
            "confirmDelete": "Are you sure you want to delete the story?"
        };
        stories = [{ "_id": "id1", "title": "title1" }, { "_id": "id2", "title": "title2" }];
        sandbox.stub(Locale, "applicationStrings").returns({
            "messages": {
                "storyBoard": storyBoardMessages
            }
        });
        storyBoardCards = TestUtils.renderIntoDocument(
          <StoryCards stories = {stories} dispatch={anonymousFun}/>
        );
    });

    afterEach("StoryCards", () => {
        sandbox.restore();
    });

    it("should have the stories based on props input", () => {
        let storiesList = ReactDOM.findDOMNode(storyBoardCards).querySelectorAll("ul li.added-card");
        assert.strictEqual(2, storiesList.length);    //eslint-disable-line no-magic-numbers
    });

    it("should have the remove icon", () => {
        let storiesList = ReactDOM.findDOMNode(storyBoardCards).querySelectorAll("ul li.added-card i.delete-icon");
        assert.strictEqual(2, storiesList.length);    //eslint-disable-line no-magic-numbers
        assert.isNull(ReactDOM.findDOMNode(storyBoardCards).querySelector("confirm-mask"));
    });

    it("onclick of remove icon should dispatch event", () => {
        const storyBoardCards1 = TestUtils.renderIntoDocument(
            <StoryCards stories = {stories} dispatch={anonymousFun}/>
        );

        let storiesList = ReactDOM.findDOMNode(storyBoardCards1).querySelectorAll("ul li.added-card i.delete-icon");
        let [story1] = storiesList;
        let deleteMock = sinon.mock(storyBoardCards1).expects("_showDeleteConfirmPopup");
        TestUtils.Simulate.click(story1);
        assert.isDefined(ReactDOM.findDOMNode(storyBoardCards).querySelector("confirm-mask"));
        assert.strictEqual(story1.className, "fa fa-remove icon delete-icon");
        deleteMock.verify();
    });

    it("should have story name", () => {
        const [nodeList] = ReactDOM.findDOMNode(storyBoardCards).querySelectorAll("ul li.added-card a.navigation-link div.card i");
        let storyTitle = nodeList.textContent;
        assert.strictEqual("title1", storyTitle);
    });

    it("should have the storycard link to /story-board/story/edit/id1 with storyId", () => {
        assert.strictEqual("/story-board/story/edit/id1", storyBoardCards.refs.storyid1.props.to);
        assert.strictEqual("/story-board/story/edit/id2", storyBoardCards.refs.storyid2.props.to);
    });

    it("should display the title of the stories", () => {
        assert.strictEqual("title1", storyBoardCards.refs.titletitle1.innerHTML);
        assert.strictEqual("title2", storyBoardCards.refs.titletitle2.innerHTML);
    });

    it("should have the new story card link to /story-board/story", () => {
        assert.strictEqual("/story-board/story", storyBoardCards.refs.newStoryCard.props.to);
    });
});
