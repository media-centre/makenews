/* eslint react/no-danger:0 max-len:0 */
"use strict";

import React, { Component, PropTypes } from "react";
import FeedHeader from "./FeedHeader.jsx";
import Spinner from "../../utils/components/Spinner.jsx";
import getHtmlContent from "../../utils/HtmContent.js";
import ConfirmPopup from "../../utils/components/ConfirmPopup/ConfirmPopup";


export default class ImageGallery extends Component {
    constructor(props) {
        super(props);

        this.state = {
            "showFeed": true, "showCustomPopup": false
        };
    }

    _onLoadImage(index) {
        let item = this.refs["gallery-item-" + index];
        item.querySelector("img").classList.remove("hide");
        const spinner = item.querySelector(".custom-spinner");
        if(spinner) {
            spinner.remove();
        }
    }

    _showConfirmPopup() {
        this.setState({ "showCustomPopup": true });
    }

    _parkFeed(feedDoc) {
        if(this.props.category.sourceId === "") {
            this._showConfirmPopup();
        } else {
            this.props.dispatch(this.props.clickHandler(feedDoc));
            this.setState({ "showFeed": false });
        }
    }

    handleDeleteClick(event) {
        if(event.OK) {
            this.props.dispatch(this.props.clickHandler(this.props.category));
            this.setState({ "showCustomPopup": false, "showFeed": false });
        } else {
            this.setState({ "showCustomPopup": false });
        }
    }

    render() {
        let header = this.props.category.feedType ? <FeedHeader actionComponent={this.props.actionComponent} feedAction={this._parkFeed.bind(this, this.props.category)} categoryNames={this.props.category.categoryNames} feedType={this.props.category.feedType} tags={this.props.category.tags} postedDate={this.props.category.postedDate} /> : null;
        let images = this.props.category.images.map((image, index)=>
            <li className="image-container box" ref={"gallery-item-" + index} key={index}>
                <img src={image.url} onLoad={() => this._onLoadImage(index)} onError={() => this._onLoadImage(index)} className="hide"/>
                <Spinner/>
            </li>
        );
        let confirmPopup = this.state.showCustomPopup ? <ConfirmPopup description={"This data will be deleted from the surf. Do you want to continue?"} callback={(event)=> this.handleDeleteClick(event)}/> : null;

        let feedStyle = this.state.showFeed ? { "display": "block" } : { "display": "none" };

        let description = this.props.category.content ? <p className="surf-description">{getHtmlContent(this.props.category.content)}</p> : null;
        return (
            <div>
                {confirmPopup}
                <div className="image-gallery" style={feedStyle}>
                    <a target="_blank" href={this.props.category.link}>
                        <div className="title">{this.props.category.title}</div>
                        <ul className="gallery-list h-center">{images}</ul>
                        {description}
                   </a>
                    {header}

                </div>
            </div>

        );
    }
}
ImageGallery.displayName = "ImageGallery";

ImageGallery.propTypes = {
    "category": PropTypes.object,
    "dispatch": PropTypes.func.isRequired,
    "clickHandler": PropTypes.func,
    "actionComponent": PropTypes.func
};
