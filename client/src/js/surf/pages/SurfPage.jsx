/* eslint brace-style:0, max-len:0 */
"use strict";

import React, { Component, PropTypes } from "react";
import AllFeeds from "../components/AllFeeds.jsx";
import SurfFeedActionComponent from "../components/SurfFeedActionComponent.jsx";
import { parkFeed } from "../../feeds/actions/FeedsActions";
import { displayAllFeedsAsync, getLatestFeedsFromAllSources } from "../actions/AllFeedsActions.js";
import { parkFeed } from "../../feeds/actions/FeedsActions";
import { connect } from "react-redux";
import { highLightTabAction } from "../../tabs/TabActions.js";
import { initialiseParkedFeedsCount } from "../../feeds/actions/FeedsActions.js";


export default class SurfPage extends Component {
    constructor(props) {
        super(props);
        this.state = { "fetchHintMessage": this.props.messages.fetchingFeeds };
    }
    componentWillMount() {
        window.scrollTo(0, 0);
        this.props.dispatch(highLightTabAction(["Surf"]));
        this.props.dispatch(initialiseParkedFeedsCount());
        this.props.dispatch(displayAllFeedsAsync((feeds)=> {
            this.setState({ "fetchHintMessage": feeds.length > 0 ? "" : this.props.messages.noFeeds });
        }));
    }

    getLatestFeeds() {
        if(this.props.refreshState) {
            return false;
        }
        this.props.dispatch(getLatestFeedsFromAllSources(()=> {}));
    }

    render() {
        let hintMsg = this.props.feeds.length === 0 ? <div className="t-center">{this.state.fetchHintMessage}</div> : null;
        let refreshButton = this.props.feeds.length === 0 ? null : <div ref="surfRefreshButton" className={this.props.refreshState ? "surf-refresh-button disabled" : "surf-refresh-button"} onClick={()=> { this.getLatestFeeds(); }}><span className="fa fa-refresh"></span><div>{this.props.refreshState ? "Refreshing..." : "Refresh Feeds"}</div></div>;

        let refreshStatus = this.props.feeds.length === 0 ? null : <div className="refresh-status progress-indicator" style={{ "width": this.props.progressPercentage + "%" }}></div>;
        return (
            <div className="surf-page-container">
                {refreshStatus}
                <div className="surf-page feeds-container">
                {refreshButton}
                {hintMsg}
                    <AllFeeds feeds={this.props.feeds} dispatch={this.props.dispatch} actionComponent={SurfFeedActionComponent} clickHandler={parkFeed}/>
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
