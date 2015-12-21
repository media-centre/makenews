/* eslint react/no-danger:0 max-len:0 */
"use strict";

import React, { Component, PropTypes } from "react";
import FeedHeader from "./FeedHeader.jsx";
import { stringToHtml } from "../../utils/StringToHtml";
import Spinner from "../../utils/components/Spinner.jsx";
import { parkFeed } from "../../feeds/actions/FeedsActions.js";

export default class ImageGallery extends Component {
    constructor(props) {
        super(props);

        this.state = {
            "showFeed": true
        };
    }

    _onLoadImage(index) {
        let item = this.refs["gallery-item-" + index];
        item.querySelector("img").classList.remove("hide");
        item.querySelector(".custom-spinner").remove();
    }

    _parkFeed(feedDoc) {
        this.setState({ "showFeed": false });
        this.props.dispatch(parkFeed(feedDoc));
    }

    render() {
        let header = this.props.category.feedType ? <FeedHeader actionComponent={this.props.actionComponent} parkFeed={this._parkFeed.bind(this, this.props.category)} categoryNames={this.props.category.categoryNames} feedType={this.props.category.feedType} tags={this.props.category.tags} /> : null;
        let images = this.props.category.images.map((image, index)=>
            <li className="image-container box" ref={"gallery-item-" + index} key={index}>
                <img src={image.url} onLoad={() => this._onLoadImage(index)} className="hide"/>
                <Spinner/>
            </li>
        );

        let feedStyle = this.state.showFeed ? { "display": "block" } : { "display": "none" };

        let description = this.props.category.content ? <p className="surf-description" dangerouslySetInnerHTML={stringToHtml(this.props.category.content)}></p> : null;
        return (
            <div className="image-gallery" style={feedStyle}>
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
    "category": PropTypes.object,
    "dispatch": PropTypes.func.isRequired,
    "parkFeed": PropTypes.func,
    "actionComponent": PropTypes.func
};
