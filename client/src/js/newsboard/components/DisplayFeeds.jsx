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
import Toast from "./../../utils/custom_templates/Toast";

const MIN_SEARCH_KEY_LENGTH = 3;

export class DisplayFeeds extends Component {

    constructor() {
        super();
        this.state = { "expandView": false, "showCollectionPopup": false, "isClicked": false, "gotNewFeeds": false, "searchToggle": false };
        this.hasMoreFeeds = true;
        this.offset = 0;
        this.key = "";
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
            this.clearState();
            this.setState({ "isClicked": false });
            this.state.searchToggle && nextProps.sourceType !== "collections" ? this.searchFeeds(nextProps.sourceType) : this.getMoreFeeds(nextProps.sourceType);//eslint-disable-line no-unused-expressions
            nextProps.sourceType === "collections" ? this.setState({ "searchToggle": false }) : ""; //eslint-disable-line no-unused-expressions
        }

        if(this.props.currentFilterSource !== nextProps.currentFilterSource) {
            this.offset = 0;
        }

        if(this.props.feeds !== nextProps.feeds) {
            const [firstArticle] = nextProps.feeds;
            if (firstArticle && !firstArticle.collection && (this.offset === 0 || nextProps.sourceType === "bookmark")) { //eslint-disable-line no-magic-numbers
                this.props.dispatch(DisplayFeedActions.displayArticle(firstArticle));
            }

            if (!firstArticle) {
                this.props.dispatch(DisplayFeedActions.clearArticle());
            }
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
                    this.state.searchToggle ? this.searchFeeds(this.props.sourceType) : this.getMoreFeeds(this.props.sourceType);//eslint-disable-line no-unused-expressions
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
            this._search();
        }
    }

    _search() {
        const key = this.refs.searchFeeds.value;
        if(!StringUtils.isEmptyString(key) && key.length >= MIN_SEARCH_KEY_LENGTH) {
            this.updateSearchState(true);
            this.clearState();
            this.searchFeeds(this.props.sourceType);
        } else {
            Toast.show("Please enter a keyword minimum of 3 characters");
        }
    }

    updateSearchState(currentSearchState) {
        this.setState({ "searchToggle": currentSearchState });
    }

    clearState() {
        this.searchOffset = 0;
        this.hasMoreSearchFeeds = true;
        this.hasMoreFeeds = true;
        this.offset = 0;
        this.props.dispatch(DisplayFeedActions.clearFeeds());
    }

    searchFeeds(sourceType) {
        const keyword = this.refs.searchFeeds.value;
        const callback = (result) => {
            this.searchOffset = result.docsLength ? (this.searchOffset + result.docsLength) : this.searchOffset;
            this.hasMoreSearchFeeds = result.hasMoreFeeds;
        };

        if(this.hasMoreSearchFeeds && !StringUtils.isEmptyString(keyword)) {
            this.props.dispatch(DisplayFeedActions.searchFeeds(sourceType, keyword, this.searchOffset, callback));
        }
    }

    _cancel() {
        this.updateSearchState(false);
        this.clearState();
        this.refs.searchFeeds.value = "";
        this.getMoreFeeds(this.props.sourceType);
    }

    displayFeeds() {
        return (this.props.currentHeaderTab === WRITE_A_STORY && this.state.isClicked
            ? <DisplayArticle articleOpen={this._isClicked.bind(this)} isStoryBoard={this.state.isClicked} />
            : <div className={this.state.expandFeedsView ? "configured-feeds-container expand" : "configured-feeds-container"}>
                <div className="search-bar">
                    <div className="input-box">
                        <input type="text" ref="searchFeeds" onKeyUp={(event) => { this.checkEnterKey(event); }} className="search-sources" placeholder={"Search Keywords,Articles etc."}/>
                        {this.state.searchToggle
                            ? <span className="input-addon" onClick={() => { this._cancel(); }}>&times;</span>
                            : <span className="input-addon" onClick={() => { this._search(); }}><i className="fa fa-search" aria-hidden="true"/></span>
                        }
                    </div>
                </div>
                { this.state.gotNewFeeds && this._showMoreFeedsButton() }
                <i onClick={() => { this._toggleFeedsView(); }} className="expand-icon" />
                <div className="feeds-container" ref="feeds">
                    <div className="feeds">
                        { this.props.feeds.map((feed, index) =>
                            <Feed feed={feed} key={index} active={feed._id === this.props.articleToDisplay._id}
                                isClicked={this._isClicked.bind(this)} dispatch={this.props.dispatch}
                            />)
                        }
                        { this.props.isFetchingFeeds ? <Spinner /> : null }
                    </div>
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
