/* eslint brace-style:0*/
import React, { Component, PropTypes } from "react";
import { newsBoardTabSwitch } from "./../actions/DisplayFeedActions";
import { connect } from "react-redux";

export class NewsBoardTab extends Component {

    displayFeeds(sourceType) {
        this.props.dispatch(newsBoardTabSwitch(sourceType));
    }

    render() {
        return (
            <a className={this.props.currentNewsBoard === this.props.sourceType ? "news-board-tab active" : "news-board-tab"}
                title={this.props.title}
                id={this.props.id}
                onClick={() => { this.displayFeeds(this.props.sourceType); }}
            >
                <i className={`icon fa fa-${this.props.sourceIcon}`} />
                {this.props.children}
            </a>
        );
    }
}

function mapToStore(store) {
    return {
        "currentNewsBoard": store.newsBoardCurrentSourceTab
    };
}

NewsBoardTab.propTypes = {
    "sourceIcon": PropTypes.string.isRequired,
    "sourceType": PropTypes.string.isRequired,
    "dispatch": PropTypes.func.isRequired,
    "currentNewsBoard": PropTypes.string.isRequired,
    "title": PropTypes.string,
    "children": PropTypes.object,
    "id": PropTypes.string
};

export default connect(mapToStore)(NewsBoardTab);
