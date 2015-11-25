"use strict";

import React, { Component, PropTypes } from "react";
import Paragraph from "./Paragraph.jsx";

export default class FeedHeader extends Component {
    render() {

        let tags = this.props.tags.map((tag, index)=> <li className="tag" key={index}>{tag}</li>);

        return (
            <div className="feed-header border-bottom box h-center">
                <span className="icon-container header-item"><i className={"feed-icon fa fa-" + this.props.feedType.toLowerCase()}></i></span>
                <span className="category-name header-item">{this.props.categoryName}</span>
                <ul className="h-center header-item">
                    {tags}
                </ul>
            </div>
        );
    }
}

FeedHeader.displayName = "FeedHeader";

FeedHeader.propTypes = {
    "feedType": PropTypes.string,
    "categoryName": PropTypes.string,
    "tags": PropTypes.array
};
