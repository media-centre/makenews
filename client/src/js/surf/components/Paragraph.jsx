/* eslint react/no-danger:0 max-len:0, no-set-state:0 */
import React, { Component, PropTypes } from "react";
import FeedHeader from "./FeedHeader";
import getHtmlContent from "../../utils/HtmContent";
import ConfirmPopup from "../../utils/components/ConfirmPopup/ConfirmPopup";
import Toast from "../../utils/custom_templates/Toast";

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
            Toast.show(feedDoc.status === "park" ? this.props.appEnMessages.parkPage.feeds.unParkedSuccess : this.props.appEnMessages.surfPage.feeds.parkedSuccess);
        }
    }

    handleDeleteClick(event) {
        this.setState({ "showCustomPopup": false });
        if(event.OK) {
            this.props.clickHandler(this.props.category);
        }
    }

    render() {
        let header = this.props.category.feedType ? <FeedHeader actionComponent={this.props.actionComponent} feedAction={this._parkFeed.bind(this, this.props.category)} categoryNames={this.props.category.categoryNames} feedType={this.props.category.feedType} tags={this.props.category.tags} postedDate={this.props.category.postedDate} /> : null;
        let confirmPopup = this.state.showCustomPopup ? <ConfirmPopup description={this.props.appEnMessages.parkPage.feeds.deletedFeedConfirm} callback={(event)=> this.handleDeleteClick(event)}/> : null;

        return (
            <div className="text-content news-feed">
                <a target="_blank" rel="noopener noreferrer" href={this.props.category.link}>
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
    "actionComponent": PropTypes.func,
    "appEnMessages": PropTypes.object
};
