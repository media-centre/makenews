/* eslint react/jsx-no-literals:0 */
import { setCurrentHeaderTab } from "./../../header/HeaderActions";
import DisplayFeeds from "./DisplayFeeds";
import React, { Component, PropTypes } from "react";
import { connect } from "react-redux";

export class ScanNews extends Component {
    componentWillMount() {
        this.props.dispatch(setCurrentHeaderTab("Scan News"));
    }

    render() {
        return (
            <div className="news-board-container">
                <span className="source-type-bar">{"Filters"}</span>
                <DisplayFeeds />
            </div>
        );
    }
}

ScanNews.propTypes = {
    "dispatch": PropTypes.func.isRequired
};

function select(store) {
    return store;
}

export default connect(select)(ScanNews);
