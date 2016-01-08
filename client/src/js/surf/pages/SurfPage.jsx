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
        this.state = { "fetchHintMessage": this.props.messages.fetchingFeeds, "refreshState": false };
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
        if(this.state.refreshState) {
            return false;
        }
        this.setState({ "refreshState": true });
        this.props.dispatch(getLatestFeedsFromAllSources());
    }

    render() {
        let hintMsg = this.props.feeds.length === 0 ? <div className="t-center">{this.state.fetchHintMessage}</div> : null;
        let refreshButton = <div ref="surfRefreshButton" className={this.state.refreshState ? "surf-refresh-button disabled" : "surf-refresh-button"} onClick={()=> { this.getLatestFeeds() }}>{"Refresh Feeds"}</div>
        return (
            <div className="surf-page feeds-container">
                {refreshButton}
                {hintMsg}
                <AllFeeds feeds={this.props.feeds} dispatch={this.props.dispatch} actionComponent={SurfFeedActionComponent} clickHandler={parkFeed}/>
            </div>
        );
    }
}

SurfPage.displayName = "SurfPage";

SurfPage.propTypes = {
    "dispatch": PropTypes.func.isRequired,
    "feeds": PropTypes.array,
    "messages": PropTypes.object
};

SurfPage.defaultProps = {
    "feeds": []
};

function select(store) {
    return store.allFeeds;
}
export default connect(select)(SurfPage);
