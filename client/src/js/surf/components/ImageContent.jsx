"use strict";

import React, { Component, PropTypes } from "react";
import FeedHeader from "./FeedHeader.jsx";

export default class ImageContent extends Component {
    render() {
        let header = this.props.category.feedType ? <FeedHeader categoryName={this.props.category.name} feedType={this.props.category.feedType} tags={this.props.category.tags} /> : null;
        return (
            <div className="image-content">
                <div className="container clear-fix">
                    <div className="img-container box m-block left">
                        <img src={this.props.category.url}/>
                    </div>
                    <p className="box">{this.props.category.content}</p>
                </div>
                {header}
            </div>
        );
    }
}
ImageContent.displayName = "ImageContent";

ImageContent.propTypes = {
    "category": PropTypes.object
};