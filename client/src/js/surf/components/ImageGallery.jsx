/* eslint react/no-danger:0 */
"use strict";

import React, { Component, PropTypes } from "react";
import FeedHeader from "./FeedHeader.jsx";
import { stringToHtml } from "../../utils/StringToHtml";

export default class ImageGallery extends Component {
    render() {
        let header = this.props.category.feedType ? <FeedHeader categoryName={this.props.category.name} feedType={this.props.category.feedType} tags={this.props.category.tags} /> : null;
        let images = this.props.category.images.map((image, index)=> <li className="image-container box" key={index}><img src={image.url}/></li>);
        let description = this.props.category.content ? <p className="surf-description" dangerouslySetInnerHTML={stringToHtml(this.props.category.content)}></p> : null;
        return (
            <div className="image-gallery">
                <div className="title">{this.props.category.title}</div>
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
