/* eslint no-magic-numbers:0*/
import React, { Component, PropTypes } from "react";
import { connect } from "react-redux";
import { Link } from "react-router";

export class StoryBoardCards extends Component {

    _renderStoriesList() {
        let allStories = { "stories": [{ "_id": "id1", "name": "name1" }, { "_id": "id2", "name": "name2" }] };
        let storiesArray = [];
        storiesArray.push(<li className="story-card" key ="0" onClick={() => this._createNewCategory()}>
                <Link className="add-card" to="storyBoard/story/1234" >
                    <i className="fa fa-plus-circle" aria-hidden="true"/>
                </Link>
        </li>);
        allStories.stories.map((story, index) =>
            storiesArray.push(
                <li key={index + 1} className="story-card">
                    <Link ref={"categoryLink_" + story._id} to={"/storyBorad/story/" + story._id + "/" + story.name} className="added-card">
                            <i ref={"category_" + story._id}>{story.name}</i>
                    </Link>
                </li>
            )
        );
        return storiesArray;
    }

    render() {
        return (
            <div className="story-board-container">
                <ul className="story-cards">
                    {this._renderStoriesList()}
                </ul>
            </div>
        );
    }
}

StoryBoardCards.propTypes = {
    "dispatch": PropTypes.func.isRequired
};


function select(store) {
    return store;
}
export default connect(select)(StoryBoardCards);

