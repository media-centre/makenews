"use strict";

import React, { Component, PropTypes } from "react";
import DateTimeUtil from "../../utils/DateTimeUtil.js";

export default class FeedHeader extends Component {
    render() {
        let localDateTime = this.props.postedDate ? DateTimeUtil.getLocalTimeFromUTC(this.props.postedDate) : null;
        let tags = this.props.tags === "" ? null : this.props.tags.map((tag, index)=> <li className="tag" key={index}>{tag}</li>);
        let actionElement = this.props.actionComponent ? React.createElement(this.props.actionComponent, this.props) : null;
        return (
            <div className="feed-header border-bottom box h-center clear-fix">
                <span className="icon-container header-item"><i className={"feed-icon fa fa-" + this.props.feedType.toLowerCase()}></i></span>
                <span className="category-name header-item">{this.props.categoryNames}</span>
                <ul className="h-center header-item">
                    <li className="tag">{localDateTime} </li>
                    {tags}
                </ul>
                {actionElement}
            </div>
        );
    }
}

FeedHeader.displayName = "FeedHeader";

FeedHeader.propTypes = {
    "actionComponent": PropTypes.func,
    "feedType": PropTypes.string,
    "categoryNames": PropTypes.string,
    "tags": PropTypes.array,
    "postedDate": PropTypes.string
};
