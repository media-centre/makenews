import React, { Component, PropTypes } from "react";
import ReactDOM from "react-dom";
import Feed from "./Feed.jsx";
import AppWindow from "./../../utils/AppWindow";
import { connect } from "react-redux";
import R from "ramda"; //eslint-disable-line id-length
import * as DisplayFeedActions from "../actions/DisplayFeedActions";
import { addToCollection } from "../actions/DisplayArticleActions";
import StringUtil from "../../../../../common/src/util/StringUtil";

export class DisplayFeeds extends Component {
    constructor() {
        super();
        this.state = { "expandView": false, "showCollectionPopup": false };
        this.hasMoreFeeds = true;
        this.offset = 0;
        this.getMoreFeeds = this.getMoreFeeds.bind(this);
        this.getFeedsCallBack = this.getFeedsCallBack.bind(this);
    }

    componentWillMount() {
        DisplayFeedActions.fetchFeedsFromSources();
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
        let callback = (result) => {
            this.offset = result.docsLength ? (this.offset + result.docsLength) : this.offset;
            this.hasMoreFeeds = result.hasMoreFeeds;
        };

        if (this.hasMoreFeeds) {
            if(sourceType === "bookmark") {
                this.props.dispatch(DisplayFeedActions.getBookmarkedFeeds(this.offset, callback));
            } else if(sourceType === "collections") {
                this.props.dispatch(DisplayFeedActions.getAllCollections(this.offset, callback));
            } else {
                this.props.dispatch(DisplayFeedActions.displayFeedsByPage(this.offset, sourceType, callback));
            }
        }
    }

    _toggleFeedsView() {
        this.setState({ "expandFeedsView": !this.state.expandFeedsView });
    }

    autoRefresh() {
        const AUTO_REFRESH_INTERVAL = AppWindow.instance().get("autoRefreshSurfFeedsInterval");
        if (!AppWindow.instance().get("autoRefreshTimer")) {
            AppWindow.instance().set("autoRefreshTimer", setInterval(() => {
                DisplayFeedActions.fetchFeedsFromSources();
            }, AUTO_REFRESH_INTERVAL));
        }
    }

    checkEnterKey(event) {
        const ENTERKEY = 13;
        if (event.keyCode === ENTERKEY) {
            this.props.dispatch(addToCollection(this.refs.collectionName.value, this.props.addArticleToCollection, true));
            this.setState({ "showCollectionPopup": false });
        }
    }

    _renderCollections() {
        let collectionsDOM = (collection) =>
            <li className="collection-name" onClick={() => {
                if(this.props.addArticleToCollection.id) {
                    this.props.dispatch(addToCollection(collection.collection, this.props.addArticleToCollection));
                }
            }} key={collection._id}
            > { collection.collection }</li>;
        return R.map(collectionsDOM, this.props.feeds);
    }

    showPopup() {
        return (
            <div className="collection-popup-overlay">
                {this.state.showCollectionPopup && <div className="new-collection">
                    <input type="text" className="new-collection-input-box" ref="collectionName"
                        placeholder="create new collection" onKeyUp={(event) => {
                            this.checkEnterKey(event);
                        }}
                    />

                    <button className="cancel-collection" onClick={() => {
                        this.setState({ "showCollectionPopup": false });
                    }}
                    >CANCEL
                    </button>

                    <button className="save-collection" onClick={() => {
                        if (!StringUtil.isEmptyString(this.refs.collectionName.value)) {
                            this.props.dispatch(addToCollection(this.refs.collectionName.value, this.props.addArticleToCollection, true));
                        }
                        this.setState({ "showCollectionPopup": false });
                    }}
                    >SAVE
                    </button>
                </div>
                }
                </div>
        );
    }

    displayCollections() {
        return (<div className="configured-feeds-container" >
            <div className="create_collection" onClick={() => {
                this.setState({ "showCollectionPopup": true });
            }}
            >
                <i className="fa fa-plus-circle"/> Create new collection
            </div>

            { this.state.showCollectionPopup ? this.showPopup() : null}
            <div className="feeds">
                <ul className="configured-sources">
                    { this._renderCollections() }
                </ul>
            </div>
        </div>);
    }

    render() {
        return (
            this.props.sourceType === "collections" ? this.displayCollections()
            : <div className={this.state.expandFeedsView ? "configured-feeds-container expand" : "configured-feeds-container"}>
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
        "articleToDisplay": store.selectedArticle._id,
        "addArticleToCollection": store.addArticleToCollection
    };
}

DisplayFeeds.propTypes = {
    "dispatch": PropTypes.func.isRequired,
    "feeds": PropTypes.array.isRequired,
    "sourceType": PropTypes.string.isRequired,
    "articleToDisplay": PropTypes.string,
    "addArticleToCollection": PropTypes.object
};

export default connect(mapToStore)(DisplayFeeds);
