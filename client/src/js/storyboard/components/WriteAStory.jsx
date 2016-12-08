/* eslint react/jsx-no-literals:0 */
import React, { Component, PropTypes } from "react";
import { setCurrentHeaderTab } from "./../../header/HeaderActions";
import { connect } from "react-redux";

export class WriteAStory extends Component {

    componentWillMount() {
        this.props.dispatch(setCurrentHeaderTab("Write a Story"));
    }
    render() {
        return (
            <div>
                <h1>Write A Story </h1>
            </div>
        );
    }
}


WriteAStory.propTypes = {
    "dispatch": PropTypes.func.isRequired
};


function select(store) {
    return store;
}
export default connect(select)(WriteAStory);

