/* eslint brace-style:0*/
import React, { Component, PropTypes } from "react";
import Feed from "./Feed.jsx";
import AppWindow from "./../../utils/AppWindow";
import { connect } from "react-redux";
import * as DisplayFeedActions from "../actions/DisplayFeedActions";
import R from "ramda"; //eslint-disable-line id-length
import DisplayCollection from "./DisplayCollection";
import Spinner from "../../utils/components/Spinner";
import { WRITE_A_STORY } from "./../../header/HeaderActions";
import DisplayArticle from "./DisplayArticle";
import StringUtils from "./../../../../../common/src/util/StringUtil";

export class DisplayFeeds extends Component {
    constructor() {
        super();
        this.state = { "expandView": false, "showCollectionPopup": false, "isClicked": false, "gotNewFeeds": false, "search": false };
        this.hasMoreFeeds = true;
        this.offset = 0;
        this.getMoreFeeds = this.getMoreFeeds.bind(this);
        this.getFeedsCallBack = this.getFeedsCallBack.bind(this);
        this.fetchFeedsFromSources = this.fetchFeedsFromSources.bind(this);
    }

    async componentWillMount() {
        await this.autoRefresh();
    }

    async componentDidMount() {
        await this.fetchFeedsFromSources(false);
        window.scrollTo(0, 0); //eslint-disable-line no-magic-numbers
        this.feedsDOM = this.refs.feeds;
        if(this.feedsDOM) {
            this.feedsDOM.addEventListener("scroll", this.getFeedsCallBack);
        }
        this.getMoreFeeds(this.props.sourceType);
        this.props.dispatch(DisplayFeedActions.clearFeeds());
    }

    componentWillReceiveProps(nextProps) {
        if(this.props.sourceType !== nextProps.sourceType) {
            this.hasMoreFeeds = true;
            this.offset = 0;
            this.getMoreFeeds(nextProps.sourceType);
            this.props.dispatch(DisplayFeedActions.clearFeeds());
            this.setState({ "isClicked": false });
        }

        if(this.props.currentFilterSource !== nextProps.currentFilterSource) {
            this.offset = 0;
        }

        const firstArticleIndex = 0;
        let [firstArticle] = nextProps.feeds;
        if(firstArticle && !firstArticle.collection && this.offset === firstArticleIndex && this.props.feeds !== nextProps.feeds) {
            if(!nextProps.articleToDisplay._id && this.currentArticle) {
                firstArticle = this.currentArticle;
            }
            this.props.dispatch(DisplayFeedActions.displayArticle(firstArticle));
        }

        if(this.props.articleToDisplay !== nextProps.articleToDisplay && nextProps.articleToDisplay._id) {
            this.currentArticle = nextProps.articleToDisplay;
        }
    }

    componentWillUnmount() {
        if(this.feedsDOM) {
            this.feedsDOM.removeEventListener("scroll", this.getFeedsCallBack);
        }
    }

    getFeedsCallBack() {
        if (!this.timer) {
            const scrollTimeInterval = 250;
            this.timer = setTimeout(() => {
                this.timer = null;
                const scrollTop = this.feedsDOM.scrollTop;
                if (scrollTop && scrollTop + this.feedsDOM.clientHeight >= this.feedsDOM.scrollHeight) {
                    this.getMoreFeeds(this.props.sourceType);
                }
            }, scrollTimeInterval);
        }
    }

    async fetchFeedsFromSources(param) {
        const hasConfiguredSources = R.pipe(
            R.values,
            R.any(sources => sources.length)
        )(this.props.configuredSources);

        if(hasConfiguredSources) {
            const response = await DisplayFeedActions.fetchFeedsFromSources(param);
            if(response) {
                this.setState({ "gotNewFeeds": true });
            }
        }
    }

    getMoreFeeds(sourceType) {
        let callback = (result) => {
            this.offset = result.docsLength ? (this.offset + result.docsLength) : this.offset;
            this.hasMoreFeeds = result.hasMoreFeeds;
        };

        if (this.hasMoreFeeds) {
            this.props.dispatch(DisplayFeedActions.fetchingFeeds(true));
            if(sourceType === "bookmark") {
                this.props.dispatch(DisplayFeedActions.getBookmarkedFeeds(this.offset, callback));
            } else if(sourceType === "collections") {
                this.props.dispatch(DisplayFeedActions.getAllCollections(this.offset, callback));
            } else {
                let filter = {};
                if(sourceType === "trending") {
                    filter.sources = this.props.currentFilterSource;
                } else {
                    filter.sources = {};
                    filter.sources[sourceType] = this.props.currentFilterSource[sourceType];
                }
                this.props.dispatch(DisplayFeedActions.displayFeedsByPage(this.offset, filter, callback));
            }
        }
    }

    _toggleFeedsView() {
        this.setState({ "expandFeedsView": !this.state.expandFeedsView });
    }

    autoRefresh() {
        const AUTO_REFRESH_INTERVAL = AppWindow.instance().get("autoRefreshSurfFeedsInterval");
        if (!AppWindow.instance().get("autoRefreshTimer")) {
            AppWindow.instance().set("autoRefreshTimer", setInterval(async() => {
                await this.fetchFeedsFromSources(true);
            }, AUTO_REFRESH_INTERVAL));
        }
    }
    _isClicked() {
        this.setState({ "isClicked": !this.state.isClicked });
    }

    _showMoreFeedsButton() {
        return (
            <button className="newsfeeds-notify" onClick={() => {
                this.setState({ "gotNewFeeds": false });
                this.offset = 0;
                this.hasMoreFeeds = true;
                this.props.dispatch(DisplayFeedActions.clearFeeds());
                this.getMoreFeeds(this.props.sourceType);
            }}
            > {"Show new feeds"} </button>);
    }

    checkEnterKey(event) {
        const ENTERKEY = 13;
        if (event.keyCode === ENTERKEY) {
            this.updateSearch();
            this.searchFeeds();
        }
    }

    updateSearch() {
        this.props.dispatch(DisplayFeedActions.clearFeeds());
        this.offset = 0;
        this.setState({ "search": !this.state.search });
    }

    searchFeeds() {
        const searchKey = this.refs.searchFeeds.value;
        if(!StringUtils.isEmptyString(searchKey)) {
            this.props.dispatch(DisplayFeedActions.searchFeeds(this.props.sourceType, searchKey, this.offset));
        }
    }

    displayFeeds() {
        return (this.props.currentHeaderTab === WRITE_A_STORY && this.state.isClicked
            ? <DisplayArticle articleOpen={this._isClicked.bind(this)} isStoryBoard={this.state.isClicked} />
            : <div className={this.state.expandFeedsView ? "configured-feeds-container expand" : "configured-feeds-container"}>
                <div className="search-bar">
                    <div className="input-box">
                        <input type="text" ref="searchFeeds" onKeyUp={(event) => { this.checkEnterKey(event); }} className="search-sources" placeholder={"Search Keywords,Articles etc."}/>
                        {this.state.search
                            ? <span className="input-addon" onClick={() => { this.updateSearch(); this.getMoreFeeds(this.props.sourceType); }}><i className="fa fa-times" aria-hidden="true"/></span>
                            : <span className="input-addon" onClick={() => { this.updateSearch(); this.searchFeeds(); }}><i className="fa fa-search" aria-hidden="true"/></span>
                        }
                    </div>
                </div>
                { this.state.gotNewFeeds && this._showMoreFeedsButton() }
                <i onClick={() => { this._toggleFeedsView(); }} className="expand-icon" />
                <div className="feeds" ref="feeds">
                    { this.props.feeds.map((feed, index) =>
                        <Feed feed={feed} key={index} active={feed._id === this.props.articleToDisplay._id}
                            isClicked={this._isClicked.bind(this)} dispatch={this.props.dispatch}
                        />)
                    }
                    { this.props.isFetchingFeeds ? <Spinner /> : null }
                </div>
            </div>);
    }

    render() {
        return (
            this.props.sourceType === "collections" ? <DisplayCollection /> : this.displayFeeds()
        );
    }
}

function mapToStore(store) {
    return {
        "feeds": store.fetchedFeeds,
        "sourceType": store.newsBoardCurrentSourceTab,
        "articleToDisplay": store.selectedArticle,
        "currentFilterSource": store.currentFilterSource,
        "configuredSources": store.configuredSources,
        "isFetchingFeeds": store.fetchingFeeds
    };
}

DisplayFeeds.propTypes = {
    "dispatch": PropTypes.func.isRequired,
    "feeds": PropTypes.array.isRequired,
    "sourceType": PropTypes.string.isRequired,
    "articleToDisplay": PropTypes.object,
    "currentFilterSource": PropTypes.object,
    "configuredSources": PropTypes.object,
    "isFetchingFeeds": PropTypes.bool,
    "currentHeaderTab": PropTypes.string
};

export default connect(mapToStore)(DisplayFeeds);
