/* eslint react/no-danger:0 max-len:0 */
"use strict";
import React, { Component, PropTypes } from "react";
import FeedHeader from "./FeedHeader.jsx";
import getHtmlContent from "../../utils/HtmContent.js";
import ConfirmPopup from "../../utils/components/ConfirmPopup/ConfirmPopup";

export default class Paragraph extends Component {
    constructor(props) {
        super(props);

        this.state = {
            "showCustomPopup": false
        };
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
        let confirmPopup = this.state.showCustomPopup ? <ConfirmPopup description={"This data will be deleted from the surf. Do you want to continue?"} callback={(event)=> this.handleDeleteClick(event)}/> : null;

        return (
            <div>
            <a target="_blank" href={this.props.category.link}>
                <div className="title">{this.props.category.title}</div>
                <p className="surf-description">{getHtmlContent(this.props.category.content)}</p>
            </a>
                {header}
                {confirmPopup}
            </div>
        );
    }
}


Paragraph.displayName = "Paragraph";

Paragraph.propTypes = {
    "dispatch": PropTypes.func,
    "clickHandler": PropTypes.func,
    "category": PropTypes.object,
    "actionComponent": PropTypes.func
};
