/* eslint brace-style:0, max-len:0, no-set-state:0,no-unused-vars:0, max-nested-callbacks:0, no-did-mount-set-state:0, react/self-closing-comp:0 */
import React, { Component, PropTypes } from "react";
import AllFeeds from "../components/AllFeeds";
import SurfFeedActionComponent from "../components/SurfFeedActionComponent";
import SurfFilter from "../components/SurfFilter";
import { initiateSurf, getLatestFeedsFromAllSources, fetchFeedsByFilter, fetchFeedsByPage, parkFeed } from "../actions/SurfActions";
import { connect } from "react-redux";
import { highLightTabAction } from "../../tabs/TabActions";
import { initialiseParkedFeedsCount } from "../../feeds/actions/FeedsActions";
import Toast from "../../utils/custom_templates/Toast";
import TakeTour from "../../utils/custom_templates/TakeTour";
import AppWindow from "../../utils/AppWindow";

export class SurfPage extends Component {
    constructor(props) {
        super(props);

        let filter = {
            "mediaTypes": [],
            "categories": [],
            "sourceTypes": []
        };
        this.state = { "filter": filter, "lastIndex": 0, "showPaginationSpinner": false, "hasMoreFeeds": true, "showFilterSpinner": false, "refreshState": this.props.refreshState };
    }
    componentWillMount() {
        window.scrollTo(0, 0); //eslint-disable-line no-magic-numbers
        this.takeTour();
        this.props.dispatch(initiateSurf(()=> {
            this.setState({ "filter": this.props.surfFilter });
        }));
        this.props.dispatch(highLightTabAction(["Surf"]));
        this.props.dispatch(initialiseParkedFeedsCount());
        this.paginateFeeds();
        this.autoRefresh();
    }

    componentWillUnmount() {
        document.removeEventListener("scroll", () => this.getFeedsCallBack());
    }

    paginateFeeds() {
        document.addEventListener("scroll", () => this.getFeedsCallBack());
    }

    autoRefresh() {
        const AUTO_REFRESH_INTERVAL = AppWindow.instance().get("autoRefreshSurfFeedsInterval");
        let skipSessionTimer = true;

        if(!AppWindow.instance().get("autoRefreshTimer")) {
            AppWindow.instance().set("autoRefreshTimer", setInterval(() => {
                this.getLatestFeeds(skipSessionTimer);
            }, AUTO_REFRESH_INTERVAL));
        }
    }

    getFeedsCallBack() {
        if (Math.abs(document.body.scrollHeight - (pageYOffset + innerHeight)) < 1) { //eslint-disable-line no-magic-numbers
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
                result.lastIndex = result.lastIndex === 0 ? this.state.lastIndex : result.lastIndex; //eslint-disable-line no-magic-numbers
                result.hasMoreFeeds = typeof result.hasMoreFeeds === "undefined" ? true : result.hasMoreFeeds;
                this.setState({ "showPaginationSpinner": false, "lastIndex": result.lastIndex, "hasMoreFeeds": result.hasMoreFeeds });
            }));
        }

        if(!this.state.hasMoreFeeds) {
            Toast.show(this.props.messages.noMoreFeeds);
        }
    }

    getLatestFeeds(skipSessionTimer) {  //eslint-disable-line consistent-return
        if(this.state.refreshState) {
            return false;
        }
        this.setState({ "refreshState": true });
        this.props.dispatch(getLatestFeedsFromAllSources(()=> {
            this.setState({ "refreshState": false });
        }, skipSessionTimer));
    }

    parkFeedItem(feedDoc) {
        this.props.dispatch(parkFeed(feedDoc, ()=> {
            if(this.props.feeds.length === 0) { //eslint-disable-line no-magic-numbers
                this.props.dispatch(fetchFeedsByPage(0, (filteredObj)=> { //eslint-disable-line no-magic-numbers
                    this.setState({ "lastIndex": filteredObj.lastIndex });
                }));
            }
        }));
    }

    getHintMessage() {
        if(!this.props.feeds) {
            return <div className="feed-hint t-center">{this.props.messages.fetchingFeeds}</div>;
        } else if (this.props.feeds.length === 0) { //eslint-disable-line no-magic-numbers
            return <div className="feed-hint t-center">{this.props.messages.noFeeds}</div>;
        }
        return null;
    }

    updateFilter(latestFilterDocument) {
        this.setState({ "showFilterSpinner": true });
        this.props.dispatch(fetchFeedsByFilter(latestFilterDocument, (result)=> {
            this.setState({ "filter": this.props.surfFilter, "showPaginationSpinner": false, "lastIndex": result.lastIndex, "hasMoreFeeds": result.hasMoreFeeds, "showFilterSpinner": false });
        }));
    }

    takeTour() {
        TakeTour.isTourRequired().then(tourRequired => {
            if(tourRequired) {
                TakeTour.show();
            }
        });
    }

    render() {
        let refreshButton = (<div ref="surfRefreshButton" className={this.state.refreshState ? "surf-refresh-button disabled" : "surf-refresh-button"} onClick={()=> { this.getLatestFeeds(false); }}>
                                <i className="fa fa-refresh" />
                                {this.props.refreshState ? " Refreshing..." : " Refresh Feeds"}
                            </div>);
        let refreshStatus = <div className="refresh-status progress-indicator" style={{ "width": this.props.progressPercentage + "%" }}></div>;
        let paginationSpinner = this.state.showPaginationSpinner ? <div className="pagination-spinner">{"Fetching Feeds ..."}</div> : null;
        let mask = this.state.showFilterSpinner ? <div className="mask"><div className="spinner">{"Fetching filtered feeds ...."}</div></div> : null;
        let allFeeds = <AllFeeds feeds={this.props.feeds} dispatch={this.props.dispatch} actionComponent={SurfFeedActionComponent} clickHandler={(feedDoc) => this.parkFeedItem(feedDoc)}/>;
        let hint = this.getHintMessage();
        let sourceTypeFilter = [
            {
                "name": "RSS",
                "image": "rss",
                "_id": "rss"
            },
            {
                "name": "Facebook",
                "image": "facebook",
                "_id": "facebook"
            },
            {
                "name": "Twitter",
                "image": "twitter",
                "_id": "twitter"
            }
        ];
        let mediaTypes = [
            {
                "name": "Text",
                "image": "file-text-o",
                "_id": "description"
            }, {
                "name": "Image",
                "image": "file-picture-o",
                "_id": "imagecontent"
            }
        ];
        return (
            <div className="surf-page-container">
                <SurfFilter updateFilter={this.updateFilter.bind(this)} categories={this.props.categories} filter={this.state.filter} sourceTypeFilter={sourceTypeFilter} mediaTypes={mediaTypes}/>
                {refreshStatus}
                <div className="surf-page feeds-container">
                    {refreshButton}
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
    "lastIndex": PropTypes.number,
    "surfFilter": PropTypes.object,
    "categories": PropTypes.array
};

SurfPage.defaultProps = {
    "categories": []
};

function select(store) {
    return store.allFeeds;
}
export default connect(select)(SurfPage);
