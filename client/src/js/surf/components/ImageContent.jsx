"use strict";

import React, { Component, PropTypes } from "react";
import FeedHeader from "./FeedHeader.jsx";

export default class ImageContent extends Component {
    render() {
        let header = this.props.category.feedType ? <FeedHeader categoryName={this.props.category.name} feedType={this.props.category.feedType} tags={this.props.category.tags} /> : null;
        return (
            <div className="image-content">
                {header}
                <div className="container clear-fix">
                    <div className="img-container box m-block left">
                        <img src={this.props.category.url}/>
                    </div>
                    <p className="box left m-input-block">{this.props.category.content}</p>
                </div>
            </div>
        );
    }
}
ImageContent.displayName = "ImageContent";

ImageContent.propTypes = {
    "category": PropTypes.object
};