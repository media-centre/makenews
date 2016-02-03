/* eslint brace-style:0, max-len:0 */
"use strict";

import React, { Component, PropTypes } from "react";
import AllFeeds from "../components/AllFeeds.jsx";
import SurfFeedActionComponent from "../components/SurfFeedActionComponent.jsx";
import { displayAllFeedsAsync, getLatestFeedsFromAllSources } from "../actions/AllFeedsActions.js";
import { parkFeed } from "../../feeds/actions/FeedsActions";
import { connect } from "react-redux";
import { highLightTabAction } from "../../tabs/TabActions.js";
import { initialiseParkedFeedsCount } from "../../feeds/actions/FeedsActions.js";


export class SurfPage extends Component {
    constructor(props) {
        super(props);
        this.state = { "fetchHintMessage": this.props.messages.fetchingFeeds };
    }
    componentWillMount() {
        window.scrollTo(0, 0);
        this.props.dispatch(highLightTabAction(["Surf"]));
        this.props.dispatch(initialiseParkedFeedsCount());
        this.props.dispatch(displayAllFeedsAsync());
    }


    getLatestFeeds() {
        if(this.props.refreshState) {
            return false;
        }
        this.props.dispatch(getLatestFeedsFromAllSources());
    }

    parkFeedItem(feedDoc) {
        this.props.dispatch(parkFeed(feedDoc));
    }

    getHintMessage() {
        if (this.props.feeds.length === 0) {
            if (this.state.fetchHintMessage === this.props.messages.fetchingFeeds) {
                return <div className="t-center">{this.state.fetchHintMessage}</div>;
            }
            return <div className="t-center">{this.props.messages.noFeeds}</div>;
        }
        return null;
    }

    render() {
        let refreshButton = this.props.feeds.length === 0 ? null : <div ref="surfRefreshButton" className={this.props.refreshState ? "surf-refresh-button disabled" : "surf-refresh-button"} onClick={()=> { this.getLatestFeeds(); }}><span className="fa fa-refresh"></span>{this.props.refreshState ? " Refreshing..." : " Refresh Feeds"}</div>;

        let refreshStatus = this.props.feeds.length === 0 ? null : <div className="refresh-status progress-indicator" style={{ "width": this.props.progressPercentage + "%" }}></div>;
        return (
            <div className="surf-page-container">
                {refreshStatus}
                <div className="surf-page feeds-container">
                {refreshButton}
                {this.getHintMessage()}
                    <AllFeeds feeds={this.props.feeds} dispatch={this.props.dispatch} actionComponent={SurfFeedActionComponent} clickHandler={(feedDoc) => this.parkFeedItem(feedDoc)}/>
                </div>
            </div>
        );
    }
}

SurfPage.displayName = "SurfPage";

SurfPage.propTypes = {
    "dispatch": PropTypes.func.isRequired,
    "feeds": PropTypes.array,
    "messages": PropTypes.object,
    "progressPercentage": PropTypes.number,
    "refreshState": PropTypes.bool
};

SurfPage.defaultProps = {
    "feeds": []
};

function select(store) {
    return store.allFeeds;
}
export default connect(select)(SurfPage);
