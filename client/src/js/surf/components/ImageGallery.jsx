"use strict";

import React, { Component, PropTypes } from "react";
import FeedHeader from "./FeedHeader.jsx";

export default class ImageGallery extends Component {
    render() {
        let header = this.props.category.feedType ? <FeedHeader categoryName={this.props.category.name} feedType={this.props.category.feedType} tags={this.props.category.tags} /> : null;
        let images = this.props.category.images.map((image, index)=>  <li className="image-container box" key={index}><img src={image.url}/></li> );
        let description = this.props.category.content ? <p className="surf-description">{this.props.category.content}</p> : null;
        return (
            <div className="image-gallery">
                <ul className="gallery-list h-center">{images}</ul>
                {description}
                {header}
            </div>

        );
    }
}
ImageGallery.displayName = "ImageGallery";

ImageGallery.propTypes = {
    "category": PropTypes.object
};