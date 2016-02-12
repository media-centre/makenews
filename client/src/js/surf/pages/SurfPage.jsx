/* eslint brace-style:0, max-len:0, no-set-state:0,no-unused-vars:0, max-nested-callbacks:0, no-did-mount-set-state:0 */
"use strict";

import React, { Component, PropTypes } from "react";
import AllFeeds from "../components/AllFeeds.jsx";
import SurfFeedActionComponent from "../components/SurfFeedActionComponent.jsx";
import SurfFilter from "../components/SurfFilter.jsx";
import { displayAllFeedsAsync, getLatestFeedsFromAllSources, storeFilterAndSourceHashMap, fetchFeedsByFilter, fetchAllCategories, fetchFeedsByPage, parkFeed } from "../actions/SurfActions.js";
import { connect } from "react-redux";
import { highLightTabAction } from "../../tabs/TabActions.js";
import { initialiseParkedFeedsCount } from "../../feeds/actions/FeedsActions.js";
import Toast from "../../utils/custom_templates/Toast.js";
import TakeTour from "../../utils/custom_templates/TakeTour.js";
import SourceTypeFilter from "../components/SourceTypeFilter.jsx";

export class SurfPage extends Component {
    constructor(props) {
        super(props);
        let filter = {
            "mediaTypes": [],
            "categories": [],
            "sourceTypes": []
        };
        this.state = { "fetchHintMessage": this.props.messages.fetchingFeeds, "categories": [], "filter": filter, "lastIndex": 0, "showPaginationSpinner": false, "hasMoreFeeds": true, "showFilterSpinner": false, "refreshState": this.props.refreshState };
    }
    componentWillMount() {
        window.scrollTo(0, 0);

        this.props.dispatch(storeFilterAndSourceHashMap((result)=> {
            this.props.dispatch(fetchAllCategories((categories)=> {
                this.props.dispatch(fetchFeedsByPage(0, (filteredObj)=> {
                    this.setState({ "fetchHintMessage": filteredObj.feeds.length > 0 ? "" : this.props.messages.noFeeds, "filter": result.surfFilter, "categories": categories, "lastIndex": filteredObj.lastIndex });
                }));
            }));
        }));
        this.props.dispatch(highLightTabAction(["Surf"]));
        this.props.dispatch(initialiseParkedFeedsCount());
        this.paginateFeeds();
    }

    componentWillUnmount() {
        document.removeEventListener("scroll", () => this.getFeedsCallBack());
    }

    paginateFeeds() {
        document.addEventListener("scroll", () => this.getFeedsCallBack());
    }

    getFeedsCallBack() {
        if (document.body.scrollHeight === pageYOffset + innerHeight) {
            this.getMoreFeeds();
        }
    }

    getMoreFeeds() {
        if(!this._reactInternalInstance) {
            return;
        }

        if(!this.state.hasMoreFeeds) {
            Toast.show(this.props.messages.noMoreFeeds);
            return;
        }

        if(!this.state.showPaginationSpinner) {
            this.setState({ "showPaginationSpinner": true });
            this.props.dispatch(fetchFeedsByPage(this.state.lastIndex, (result)=> {
                result.lastIndex = result.lastIndex === 0 ? this.state.lastIndex : result.lastIndex;
                result.hasMoreFeeds = typeof result.hasMoreFeeds === "undefined" ? true : result.hasMoreFeeds;
                this.setState({ "showPaginationSpinner": false, "lastIndex": result.lastIndex, "hasMoreFeeds": result.hasMoreFeeds });
            }));
        }

        if(!this.state.hasMoreFeeds) {
            Toast.show(this.props.messages.noMoreFeeds);
        }
    }

    getLatestFeeds() {
        if(this.state.refreshState) {
            return false;
        }
        this.setState({ "refreshState": true });
        this.props.dispatch(getLatestFeedsFromAllSources(()=> {
            this.setState({ "refreshState": false });
        }));
    }

    parkFeedItem(feedDoc) {
        this.props.dispatch(parkFeed(feedDoc, ()=> {
            if(this.props.feeds.length === 0) {
                this.props.dispatch(fetchFeedsByPage(0, (filteredObj)=> {
                    this.setState({ "fetchHintMessage": filteredObj.feeds.length > 0 ? "" : this.props.messages.noFeeds, "lastIndex": filteredObj.lastIndex });
                }));
            }
        }));
    }

    getHintMessage() {
        if (this.props.feeds.length === 0) {
            let message = this.state.fetchHintMessage === this.props.messages.fetchingFeeds ? this.state.fetchHintMessage : this.props.messages.noFeeds;
            return <div className="feed-hint t-center">{message}</div>;
            //return document.getElementById("take-tour") === null ? <div className="take-tour-text">{"Welcome to makenews for the first time."} <span className="tour-target" onClick={()=> { this.takeTour(); }}>{"Take tour"}</span> {" to learn how it works"}</div> : <div className="t-center">{this.props.messages.noFeeds}</div>;
        }
        return null;
    }

    updateFilter(latestFilterDocument) {
        this.setState({ "showFilterSpinner": true });
        this.props.dispatch(fetchFeedsByFilter(latestFilterDocument, (result)=> {
            this.setState({ "showPaginationSpinner": false, "lastIndex": result.lastIndex, "hasMoreFeeds": result.hasMoreFeeds, "showFilterSpinner": false });
        }));
    }

    takeTour() {
        TakeTour.show();
    }

    updateSourceFilter(type) {

    }

    render() {
        let refreshButton = <div ref="surfRefreshButton" className={this.state.refreshState ? "surf-refresh-button disabled" : "surf-refresh-button"} onClick={()=> { this.getLatestFeeds(); }}><span className="fa fa-refresh"></span>{this.state.refreshState ? " Refreshing..." : " Refresh Feeds"}</div>;
        let refreshStatus = <div className="refresh-status progress-indicator" style={{ "width": this.props.progressPercentage + "%" }}></div>;
        let paginationSpinner = this.state.showPaginationSpinner ? <div className="pagination-spinner">{"Fetching Feeds ..."}</div> : null;
        let mask = this.state.showFilterSpinner ? <div className="mask"><div className="spinner">{"Fetching filtered feeds ...."}</div></div> : null;
        let allFeeds = <AllFeeds feeds={this.props.feeds} dispatch={this.props.dispatch} actionComponent={SurfFeedActionComponent} clickHandler={(feedDoc) => this.parkFeedItem(feedDoc)}/>;
        let hint = this.getHintMessage();
        let sourceTypeFilter = <SourceTypeFilter filter={this.state.filter} dispatchFilterAction={this.updateFilter.bind(this)}/>;
        return (
            <div className="surf-page-container">
                <SurfFilter updateFilter={this.updateFilter.bind(this)} categories={this.state.categories} filter={this.state.filter}/>
                {refreshStatus}
                <div className="surf-page feeds-container">
                    {refreshButton}
                    {sourceTypeFilter}
                    {hint}
                    {allFeeds}
                    {paginationSpinner}
                </div>
                {mask}
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
    "refreshState": PropTypes.bool,
    "hasMoreFeeds": PropTypes.bool,
    "lastIndex": PropTypes.number
};

SurfPage.defaultProps = {
    "feeds": []
};

function select(store) {
    return store.allFeeds;
}
export default connect(select)(SurfPage);
