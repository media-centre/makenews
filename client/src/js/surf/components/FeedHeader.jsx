"use strict";

import React, { Component, PropTypes } from "react";
import FeedActionComponent from "./../../park/components/FeedActionComponent.jsx";

export default class FeedHeader extends Component {
    render() {
        let tags = this.props.tags.map((tag, index)=> <li className="tag" key={index}>{tag}</li>);
        let feedAction = null;

        if(this.props.status === "park") {
            feedAction = <FeedActionComponent />;
        } else if(!this.props.status || this.props.status === "surf") {
            feedAction = <div className="park-images right" onClick={this.props.parkFeed}> <i className="fa fa-share"></i> </div>;
        }

        return (
            <div className="feed-header border-bottom box h-center clear-fix">
                <span className="icon-container header-item"><i className={"feed-icon fa fa-" + this.props.feedType.toLowerCase()}></i></span>
                <span className="category-name header-item">{this.props.categoryNames}</span>
                <ul className="h-center header-item">
                    {tags}
                </ul>
                {feedAction}
            </div>
        );
    }
}

FeedHeader.displayName = "FeedHeader";

FeedHeader.propTypes = {
    "status": PropTypes.string,
    "feedType": PropTypes.string,
    "categoryNames": PropTypes.string,
    "tags": PropTypes.array,
    "parkFeed": PropTypes.func.isRequired
};
