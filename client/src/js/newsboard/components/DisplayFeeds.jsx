import React, { Component, PropTypes } from "react";
import ReactDOM from "react-dom";
import Feed from "./Feed.jsx";
import AppWindow from "./../../utils/AppWindow";
import { connect } from "react-redux";
import * as DisplayFeedActions from "../actions/DisplayFeedActions";

export class DisplayFeeds extends Component {
    constructor() {
        super();
        this.state = { "expandView": false };
        this.hasMoreFeeds = true;
        this.offset = 0;
        this.getMoreFeeds = this.getMoreFeeds.bind(this);
        this.getFeedsCallBack = this.getFeedsCallBack.bind(this);
    }

    componentWillMount() {
        this.autoRefresh();
    }

    componentDidMount() {
        window.scrollTo(0, 0); //eslint-disable-line no-magic-numbers
        this.dom = ReactDOM.findDOMNode(this);
        this.dom.addEventListener("scroll", this.getFeedsCallBack);
        this.getMoreFeeds(this.props.sourceType);
    }

    componentWillReceiveProps(nextProps) {
        if(this.props.sourceType !== nextProps.sourceType) {
            this.hasMoreFeeds = true;
            this.offset = 0;
            this.getMoreFeeds(nextProps.sourceType);
            this.props.dispatch(DisplayFeedActions.clearFeeds());
        }
    }

    componentWillUnmount() {
        this.dom.removeEventListener("scroll", this.getFeedsCallBack);
    }

    getFeedsCallBack() {
        if (!this.timer) {
            const scrollTimeInterval = 250;
            this.timer = setTimeout(() => {
                this.timer = null;
                const scrollTop = this.dom.scrollTop;
                if (scrollTop && scrollTop + this.dom.clientHeight >= this.dom.scrollHeight) {
                    this.getMoreFeeds(this.props.sourceType);
                }
            }, scrollTimeInterval);
        }
    }

    getMoreFeeds(sourceType) {
        if (this.hasMoreFeeds) {
            if(sourceType === "bookmark") {
                this.props.dispatch(DisplayFeedActions.getBookmarkedFeeds(this.offset, (result) => {
                    this.offset = result.docsLength ? (this.offset + result.docsLength) : this.offset;
                    this.hasMoreFeeds = result.hasMoreFeeds;
                }));
            } else {
                this.props.dispatch(DisplayFeedActions.displayFeedsByPage(this.offset, sourceType, (result) => {
                    this.offset = result.docsLength ? (this.offset + result.docsLength) : this.offset;
                    this.hasMoreFeeds = result.hasMoreFeeds;
                }));
            }
        }
    }

    _toggleFeedsView() {
        this.setState({ "expandFeedsView": !this.state.expandFeedsView });
    }

    autoRefresh() {
        console.log("**********************")
        const AUTO_REFRESH_INTERVAL = AppWindow.instance().get("autoRefreshSurfFeedsInterval");
        if (!AppWindow.instance().get("autoRefreshTimer")) {
            AppWindow.instance().set("autoRefreshTimer", setInterval(() => {
                DisplayFeedActions.fetchFeedsFromSources();
            }, AUTO_REFRESH_INTERVAL));
        }
    }

    render() {
        return (
            <div className={this.state.expandFeedsView ? "configured-feeds-container expand" : "configured-feeds-container"}>
                <button onClick={DisplayFeedActions.fetchFeedsFromSources} className="refresh-button">{"Refresh"}</button>
                <i onClick={() => {
                    this._toggleFeedsView();
                }} className="expand-icon"
                />
                <div className="feeds">
                    {this.props.feeds.map((feed, index) =>
                        <Feed feed={feed} key={index} active={feed._id === this.props.articleToDisplay} dispatch={this.props.dispatch}/>)}
                </div>
            </div>
        );
    }
}

function mapToStore(store) {
    return {
        "feeds": store.fetchedFeeds,
        "sourceType": store.newsBoardCurrentSourceTab,
        "articleToDisplay": store.selectedArticle._id
    };
}

DisplayFeeds.propTypes = {
    "dispatch": PropTypes.func.isRequired,
    "feeds": PropTypes.array.isRequired,
    "sourceType": PropTypes.string.isRequired,
    "articleToDisplay": PropTypes.string
};

export default connect(mapToStore)(DisplayFeeds);
