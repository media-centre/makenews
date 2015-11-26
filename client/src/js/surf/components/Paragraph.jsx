"use strict";
import React, { Component, PropTypes } from "react";
import FeedHeader from "./FeedHeader.jsx";

export default class Paragraph extends Component {
    render() {
        let header = this.props.category.feedType ? <FeedHeader categoryName={this.props.category.name} feedType={this.props.category.feedType} tags={this.props.category.tags} /> : null;
        return (
            <div>
                <p className="surf-description">{this.props.category.content}</p>
                {header}
            </div>
        );
    }
}

Paragraph.displayName = "Paragraph";

Paragraph.propTypes = {
    "category": PropTypes.object
};
