/* eslint react/no-danger:0 */
"use strict";

import React, { Component, PropTypes } from "react";
import FeedHeader from "./FeedHeader.jsx";
import { stringToHtml } from "../../utils/StringToHtml";
import Spinner from "../../utils/components/Spinner.jsx";

export default class ImageContent extends Component {
    _onLoadImage() {
        let item = this.refs.imageContent;
        item.querySelector("img").classList.remove("hide");
        item.querySelector(".custom-spinner").remove();
    }

    render() {
        let header = this.props.category.feedType ? <FeedHeader status={this.props.category.status} categoryNames={this.props.category.categoryNames} feedType={this.props.category.feedType} tags={this.props.category.tags} /> : null;
        return (
            <div className="image-content">
                <div className="title">{this.props.category.title}</div>
                <div className="container clear-fix">
                    <div className="img-container box m-block left" ref="imageContent">
                        <img src={this.props.category.url} onLoad={() => this._onLoadImage()} className="hide"/>
                        <Spinner/>
                    </div>
                    <p className="box" dangerouslySetInnerHTML={stringToHtml(this.props.category.content)}></p>
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
