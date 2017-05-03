/* eslint brace-style:0*/
import React, { Component } from "react";
import PropTypes from "prop-types";
import { newsBoardTabSwitch } from "./../actions/DisplayFeedActions";
import { connect } from "react-redux";

export class NewsBoardTab extends Component {
    constructor() {
        super();
        this.displayFeeds = this.displayFeeds.bind(this);
    }

    displayFeeds() {
        if(!this.props.isFetchingFeeds) {
            this.props.dispatch(newsBoardTabSwitch(this.props.sourceType));
        }
    }

    render() {
        return (
            <a className={this.props.currentNewsBoard === this.props.sourceType ? "news-board-tab active" : "news-board-tab"}
                title={this.props.title}
                id={this.props.id}
                onClick={this.displayFeeds}
            >
                <i className={`icon fa fa-${this.props.sourceIcon}`} />
                {this.props.children}
            </a>
        );
    }
}

function mapToStore(store) {
    return {
        "currentNewsBoard": store.newsBoardCurrentSourceTab,
        "isFetchingFeeds": store.fetchingFeeds
    };
}

NewsBoardTab.propTypes = {
    "sourceIcon": PropTypes.string.isRequired,
    "sourceType": PropTypes.string.isRequired,
    "dispatch": PropTypes.func.isRequired,
    "currentNewsBoard": PropTypes.string.isRequired,
    "title": PropTypes.string,
    "children": PropTypes.object,
    "id": PropTypes.string,
    "isFetchingFeeds": PropTypes.bool
};

export default connect(mapToStore)(NewsBoardTab);
