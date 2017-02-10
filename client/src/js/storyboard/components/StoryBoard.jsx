import React, { Component, PropTypes } from "react";
import { setCurrentHeaderTab } from "./../../header/HeaderActions";
import { connect } from "react-redux";

export class StoryBoard extends Component {

    componentWillMount() {
        this.props.dispatch(setCurrentHeaderTab("Write a Story"));
    }

    render() {
        return (
            <div>
                { this.props.children }
            </div>
        );
    }
}

StoryBoard.propTypes = {
    "dispatch": PropTypes.func.isRequired,
    "children": PropTypes.node
};

function select(store) {
    return store;
}
export default connect(select)(StoryBoard);

