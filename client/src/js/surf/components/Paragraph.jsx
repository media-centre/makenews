/* eslint react/no-danger:0 */
"use strict";
import React, { Component, PropTypes } from "react";
import FeedHeader from "./FeedHeader.jsx";
import { stringToHtml } from "../../utils/StringToHtml";

export default class Paragraph extends Component {

    render() {
        let header = this.props.category.feedType ? <FeedHeader categoryNames={this.props.category.name} feedType={this.props.category.feedType} tags={this.props.category.tags} /> : null;
        return (
            <div>
                <div className="title">{this.props.category.title}</div>
                <p className="surf-description" dangerouslySetInnerHTML={stringToHtml(this.props.category.content)}></p>
                {header}
            </div>
        );
    }
}

Paragraph.displayName = "Paragraph";

Paragraph.propTypes = {
    "category": PropTypes.object
};
