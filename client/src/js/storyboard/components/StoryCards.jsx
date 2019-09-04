import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import * as StoryBoardActions from "../actions/StoryBoardActions";
import { Link } from "react-router";
import Locale from "../../utils/Locale";
import { popUp } from "./../../header/HeaderActions";

export class StoryCards extends Component {

    constructor() {
        super();
        this.state = { "currentId": 0 };
        this.deleteStory = (isConfirm) => this._deleteStory(isConfirm);
        this.showDeleteConfirmPopup = (event) => this._showDeleteConfirmPopup(event);
    }
    componentDidMount() {
        this.props.dispatch(StoryBoardActions.getStories());
    }

    componentWillUnmount() {
        this.props.dispatch(StoryBoardActions.clearStories);
    }

    _showDeleteConfirmPopup(event) {
        const id = event.target.dataset.id;
        event.stopPropagation();
        event.preventDefault();
        this.props.dispatch(popUp(this.storyBoardStrings.confirmDelete, this.deleteStory));
        this.setState({ "currentId": id });
    }

    _renderStoriesList() {
        const storiesArray = this.props.stories.map((story, index) => {
            const inc = 1;
            return (<li key={index + inc} className="added-card">
                <i className="fa fa-remove icon delete-icon" onClick={this.showDeleteConfirmPopup} data-id={story._id}/>
                <Link ref={`story${story._id}`} to={`/story-board/story/edit/${story._id}`} className="navigation-link">
                    <div className="card">
                        <i ref={`title${story.title}`}>{story.title}</i>
                    </div>
                </Link>
            </li>);
        });
        storiesArray.unshift(<li className="add-card" key="0">
            <Link ref="newStoryCard" className="navigation-link" to="/story-board/story">
                <div className="card">
                    <i className="fa fa-plus-circle icon" aria-hidden="true"/>
                    {this.storyBoardStrings.createStory}
                </div>
            </Link>
        </li>);
        return storiesArray;
    }

    _deleteStory(isConfirmed) {
        if(isConfirmed) {
            this.props.dispatch(StoryBoardActions.deleteStory(this.state.currentId));
        }
    }

    render() {
        this.storyBoardStrings = Locale.applicationStrings().messages.storyBoard;

        return (
            <div>
                <div className="story-board-container">
                    <ul className="story-cards">
                        {this._renderStoriesList()}
                    </ul>
                </div>
            </div>
        );
    }
}

StoryCards.propTypes = {
    "dispatch": PropTypes.func.isRequired,
    "stories": PropTypes.array.isRequired
};


function mapToStore(store) {
    return {
        "stories": store.stories
    };
}
export default connect(mapToStore)(StoryCards);

