"use strict";

import React, { Component, PropTypes } from "react";
import DateTimeUtil from "../../utils/DateTimeUtil.js";

export default class FeedHeader extends Component {
    render() {
        let localDateTime = this.props.postedDate ? DateTimeUtil.getLocalTimeFromUTC(this.props.postedDate) : null;
        let tags = this.props.tags && this.props.tags.length > 0 ? this.props.tags.map((tag, index) => {
            if(tag !== "") {
                return <li className="tag" key={index}>{tag}</li>;
            } }) : null;
        let categoryNames = this.props.categoryNames && this.props.categoryNames.length > 0 ? this.props.categoryNames.map((categoryname, index) => {
            if(categoryname !== "") {
                return <li className="tag" key={index}>{categoryname}</li>;
            } }) : null;
        let actionElement = this.props.actionComponent ? React.createElement(this.props.actionComponent, this.props) : null;
        return (
            <div className="feed-header box h-center clear-fix">
                <span className="icon-container header-item"><i className={"feed-icon fa fa-" + this.props.feedType.toLowerCase()}></i></span>
                <ul className="h-center category-name header-item">{categoryNames}</ul>
                <ul className="h-center header-item">
                    <li className="tag date">{localDateTime} </li>
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
    "categoryNames": PropTypes.array,
    "tags": PropTypes.array,
    "postedDate": PropTypes.string,
    "feedAction": PropTypes.func
};
