/* eslint react/no-danger:0 max-len:0 */
"use strict";

import React, { Component, PropTypes } from "react";
import FeedHeader from "./FeedHeader.jsx";
import { stringToHtml } from "../../utils/StringToHtml";
import Spinner from "../../utils/components/Spinner.jsx";
import { parkFeed } from "../../feeds/actions/FeedsActions.js";

export default class ImageContent extends Component {
    constructor(props) {
        super(props);

        this.state = {
            "showFeed": true
        };
    }

    _onLoadImage() {
        let item = this.refs.imageContent;
        item.querySelector("img").classList.remove("hide");
        item.querySelector(".custom-spinner").remove();
    }

    _parkFeed(feedDoc) {
        this.setState({ "showFeed": false });
        this.props.dispatch(parkFeed(feedDoc));
    }
    render() {
        let header = this.props.category.feedType ? <FeedHeader actionComponent={this.props.actionComponent} parkFeed={this._parkFeed.bind(this, this.props.category)} categoryNames={this.props.category.categoryNames} feedType={this.props.category.feedType} tags={this.props.category.tags} /> : null;
        let feedStyle = this.state.showFeed ? { "display": "block" } : { "display": "none" };
        return (
            <div className="image-content" style={feedStyle}>
                <div className="title">{this.props.category.title}</div>
                <div className="container clear-fix">
                    <div className="img-container box m-block left" ref="imageContent">
                        <img src={this.props.category.url} onLoad={() => this._onLoadImage()} className="hide"/>
                        <Spinner/>
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
    "category": PropTypes.object,
    "dispatch": PropTypes.func,
    "parkFeed": PropTypes.func,
    "actionComponent": PropTypes.func
};
