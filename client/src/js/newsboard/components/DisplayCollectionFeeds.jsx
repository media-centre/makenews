import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import DisplayArticle from "./DisplayArticle";
import CollectionFeed from "./CollectionFeed";
import { displayCollectionFeeds, clearFeeds } from "./../actions/DisplayCollectionActions";
import { displayArticle } from "./../actions/DisplayFeedActions";
import { WRITE_A_STORY } from "./../../header/HeaderActions";
import R from "ramda"; //eslint-disable-line id-length

export class DisplayCollectionFeeds extends Component {
    constructor() {
        super();
        this.hasMoreFeeds = true;
        this.offset = 0;
        this.getMoreFeeds = this.getMoreFeeds.bind(this);
    }

    componentWillMount() {
        if(this.props.tab === "Write a Story") {
            this.getMoreFeedsCallback(this.props.collection);
        }
    }

    componentDidMount() {
        window.scrollTo(0, 0); //eslint-disable-line no-magic-numbers
        this.dom = this.refs.collection;
        this.dom.addEventListener("scroll", this.getMoreFeeds);
        this.props.dispatch(displayArticle());
    }

    componentWillReceiveProps(nextProps) {
        if(this.props.collection !== nextProps.collection) {
            this.hasMoreFeeds = true;
            this.offset = 0;
            this.props.dispatch(clearFeeds());
            this.getMoreFeedsCallback(nextProps.collection);
            this.refs.collection.style.display = "block";
            this.props.dispatch(displayArticle());
        }
    }

    componentWillUnmount() {
        this.dom.removeEventListener("scroll", this.getMoreFeeds);
        this.props.dispatch(clearFeeds());
    }

    getMoreFeeds() {
        if(this.hasMoreFeeds && !this.timer) {
            const scrollTimeInterval = 250;
            this.timer = setTimeout(() => {
                this.timer = null;
                const scrollTop = this.dom.scrollTop;
                if (scrollTop && scrollTop + this.dom.clientHeight >= this.dom.scrollHeight) {
                    this.getMoreFeedsCallback(this.props.collection);
                }
            }, scrollTimeInterval);
        }
    }

    getMoreFeedsCallback(collection) {
        let callback = (result) => {
            this.offset = result.docsLength ? (this.offset + result.docsLength) : this.offset;
            this.hasMoreFeeds = result.hasMoreFeeds;
        };

        if (this.hasMoreFeeds && !R.isEmpty(collection.name)) {
            this.props.dispatch(displayCollectionFeeds(this.offset, collection.id, callback));
        }
    }

    displayHeader() {
        return(this.props.tab === WRITE_A_STORY
            ? <header className="collection-header">
                <button className="all-collections" onClick={() => {
                    this.props.isClicked();
                }}
                ><i className="fa fa-arrow-left" aria-hidden="true"/>All Collections</button>
              </header>
            : <header className="collection-header" />);

    }

    render() {
        return (
            <div className={this.props.tab === WRITE_A_STORY ? "collections story-board-collections" : "collections"}>
                <DisplayArticle collectionDOM={this.refs.collection} collectionName={this.props.collection.name} />
                <div ref="collection" className="display-collection">
                    { this.displayHeader() }
                    <div className="collection-feeds">
                        {this.props.feeds.map((feed, index) =>
                                <CollectionFeed collectionId = {this.props.collection.id} feed={feed} key={index} dispatch={this.props.dispatch} tab={this.props.tab}/>)}
                        {!this.props.feeds.length && <div className="default-message">No feeds added to collection</div>}

                    </div>
                </div>
            </div>
        );
    }
}

DisplayCollectionFeeds.propTypes = {
    "collection": PropTypes.object.isRequired,
    "feeds": PropTypes.array.isRequired,
    "dispatch": PropTypes.func.isRequired,
    "tab": PropTypes.string,
    "isClicked": PropTypes.func
};

function mapToStore(store) {
    return {
        "feeds": store.displayCollection,
        "collection": store.currentCollection
    };
}
export default connect(mapToStore)(DisplayCollectionFeeds);
