import { StoryBoardCards } from "../../../src/js/storyboard/components/StoryBoardCards";
import TestUtils from "react-addons-test-utils";
import { assert } from "chai";
import React from "react";
import ReactDOM from "react-dom";

describe("StoryBoardCards", () => {
    let storyBoardCards = null, stories = null;
    beforeEach("StoryBoardCards", () => {
        stories = [{ "_id": "id1", "title": "title1" }, { "_id": "id2", "title": "title2" }];
        storyBoardCards = TestUtils.renderIntoDocument(
          <StoryBoardCards stories = {stories} dispatch={()=>{}}/>
        );
    });

    it("should have the stories based on props input", () => {
        let storiesList = ReactDOM.findDOMNode(storyBoardCards).querySelectorAll("ul li.story-card");
        assert.strictEqual(3, storiesList.length);    //eslint-disable-line no-magic-numbers
    });

    it("should have story name", () => {
        let storyTitle = ReactDOM.findDOMNode(storyBoardCards).querySelectorAll("ul li.story-card i")[1].textContent;        //eslint-disable-line no-magic-numbers
        assert.strictEqual("title1", storyTitle);
    });

    it("should have the storycard link to /storyBoard/story?storyId with storyId", () => {
        assert.strictEqual("/storyBoard/story?storyId=id1", storyBoardCards.refs.storyid1.props.to);
        assert.strictEqual("/storyBoard/story?storyId=id2", storyBoardCards.refs.storyid2.props.to);
    });

    it("should display the title of the stories", () => {
        assert.strictEqual("title1", storyBoardCards.refs.titletitle1.innerHTML);
        assert.strictEqual("title2", storyBoardCards.refs.titletitle2.innerHTML);
    });

    it("should have the new story card link to /storyBoard/newStory", () => {
        assert.strictEqual("/storyBoard/story", storyBoardCards.refs.newStoryCard.props.to);
        assert.strictEqual("/storyBoard/story", storyBoardCards.refs.newStoryBar.props.to);
    });

    it("should display the CreateNewStory", () => {
        assert.strictEqual("Create New Story", storyBoardCards.refs.newStoryBar.props.children[1]);   //eslint-disable-line no-magic-numbers
    });

});
