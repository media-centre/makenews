/* eslint react/no-danger:0 */
"use strict";
import React, { Component, PropTypes } from "react";
import FeedHeader from "./FeedHeader.jsx";
import { parkFeed } from "../../feeds/actions/FeedsActions.js";
import { stringToHtml } from "../../utils/StringToHtml";

export default class Paragraph extends Component {
    constructor(props) {
        super(props);

        this.state = {
            "showFeed": true
        };
    }

    _parkFeed(feedDoc) {
        this.setState({ "showFeed": false });
        this.props.dispatch(parkFeed(feedDoc));
    }

    render() {
        let header = this.props.category.feedType ? <FeedHeader status={this.props.category.status} parkFeed={this._parkFeed.bind(this, this.props.category)} categoryNames={this.props.category.categoryNames} feedType={this.props.category.feedType} tags={this.props.category.tags} /> : null;
        let feedStyle = this.state.showFeed ? { "display": "block" } : { "display": "none" };

        return (
            <div style={feedStyle}>
                <div className="title">{this.props.category.title}</div>
                <p className="surf-description" dangerouslySetInnerHTML={stringToHtml(this.props.category.content)}></p>
                {header}
            </div>
        );
    }
}


Paragraph.displayName = "Paragraph";

Paragraph.propTypes = {
    "dispatch": PropTypes.func,
    "parkFeed":PropTypes.func
};
