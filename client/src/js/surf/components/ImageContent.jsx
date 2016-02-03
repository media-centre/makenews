/* eslint react/no-danger:0 max-len:0 */
"use strict";

import React, { Component, PropTypes } from "react";
import FeedHeader from "./FeedHeader.jsx";
import Spinner from "../../utils/components/Spinner.jsx";
import getHtmlContent from "../../utils/HtmContent.js";
import ConfirmPopup from "../../utils/components/ConfirmPopup/ConfirmPopup";

export default class ImageContent extends Component {
    constructor(props) {
        super(props);

        this.state = {
            "showFeed": true, "showCustomPopup": false
        };
    }

    _onLoadImage() {
        let item = this.refs.imageContent;
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
            this.props.clickHandler(feedDoc);
        }
    }
    handleDeleteClick(event) {
        if(event.OK) {
            this.props.dispatch(this.props.clickHandler(this.props.category));
            this.setState({ "showCustomPopup": false });
        } else {
            this.setState({ "showCustomPopup": false });
        }
    }
    render() {
        let header = this.props.category.feedType ? <FeedHeader actionComponent={this.props.actionComponent} feedAction={this._parkFeed.bind(this, this.props.category)} categoryNames={this.props.category.categoryNames} feedType={this.props.category.feedType} tags={this.props.category.tags} postedDate={this.props.category.postedDate} /> : null;
        let confirmPopup = this.state.showCustomPopup ? <ConfirmPopup description={"This feed item will be deleted from the surf. Do you want to continue?"} callback={(event)=> this.handleDeleteClick(event)}/> : null;

        return (
            <div>
                {confirmPopup}
                <div className="image-content" >
                    <a target="_blank" href={this.props.category.link}>
                        <div className="title">{this.props.category.title}</div>
                        <div className="container clear-fix">
                            <div className="img-container box m-block left" ref="imageContent">
                                <img src={this.props.category.url} onLoad={() => this._onLoadImage()} onError={() => this._onLoadImage()} className="hide"/>
                                <Spinner/>
                            </div>
                            <p className="box surf-description">{getHtmlContent(this.props.category.content)}</p>
                        </div>
                   </a>
                    {header}
                </div>
            </div>
        );
    }
}
ImageContent.displayName = "ImageContent";

ImageContent.propTypes = {
    "category": PropTypes.object,
    "dispatch": PropTypes.func,
    "clickHandler": PropTypes.func,
    "actionComponent": PropTypes.func
};
