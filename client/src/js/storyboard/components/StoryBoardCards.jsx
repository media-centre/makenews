/* eslint no-magic-numbers:0*/
import React, { Component, PropTypes } from "react";
import { connect } from "react-redux";
import * as StoryBoardActions from "../actions/StoryBoardActions";
import { Link } from "react-router";

export class StoryBoardCards extends Component {

    componentDidMount() {
        this.props.dispatch(StoryBoardActions.getStories());
    }
    componentWillUnmount() {
        this.props.dispatch(StoryBoardActions.clearStories());
    }

    _renderStoriesList() {
        let storiesArray = [];
        storiesArray.push(<li className="story-card" key="0">
            <Link ref="newStoryCard" className="add-card" to="/storyBoard/story">
                <i className="fa fa-plus-circle" aria-hidden="true"/>
            </Link>
        </li>);
        this.props.stories.map((story, index) =>
            storiesArray.push(
                <li key={index + 1} className="story-card">
                    <Link ref={"story" + story._id} to={"/storyBoard/story?storyId=" + story._id} className="added-card">
                        <i ref={"title" + story.title}>{story.title}</i>
                    </Link>
                </li>
            )
        );
        return storiesArray;
    }

    render() {
        return (
            <div>
                <div className="create-story-tab">
                    <Link ref="newStoryBar" className="create-story-icon" to="/storyBoard/story">
                        <i className="fa fa-folder icon" aria-hidden="true"/>
                        { "Create New Story" }
                    </Link>
                </div>
                <div className="story-board-container">
                    <ul className="story-cards">
                        {this._renderStoriesList()}
                    </ul>
                </div>
            </div>
        );
    }
}

StoryBoardCards.propTypes = {
    "dispatch": PropTypes.func.isRequired,
    "stories": PropTypes.array.isRequired
};


function mapToStore(store) {
    return {
        "stories": store.addStory
    };
}
export default connect(mapToStore)(StoryBoardCards);

