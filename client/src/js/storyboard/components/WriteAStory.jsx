/* eslint react/jsx-no-literals:0 */
import React, { Component, PropTypes } from "react";
import { setCurrentHeaderTab } from "./../../header/HeaderActions";
import { connect } from "react-redux";
import { Link } from "react-router";

export class WriteAStory extends Component {

    componentWillMount() {
        this.props.dispatch(setCurrentHeaderTab("Write a Story"));
    }

    render() {
        return (
            <div>
                <div className="create-story-tab">
                    <Link className="create-story-icon" to="storyBoard/story/1234">
                        <i className="fa fa-folder icon" aria-hidden="true"/>
                        Create New Story
                    </Link>
                </div>
                { this.props.children }
            </div>
        );
    }
}


WriteAStory.propTypes = {
    "dispatch": PropTypes.func.isRequired,
    "children": PropTypes.node
};


function select(store) {
    return store;
}
export default connect(select)(WriteAStory);

