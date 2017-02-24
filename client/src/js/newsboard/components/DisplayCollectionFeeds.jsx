import React, { Component, PropTypes } from "react";
import { connect } from "react-redux";
import ReactDOM from "react-dom";
import DisplayArticle from "./DisplayArticle";
import CollectionFeed from "./CollectionFeed";
import { displayCollectionFeeds, clearFeeds } from "./../actions/DisplayCollectionActions";
import { displayArticle } from "./../actions/DisplayFeedActions";
import R from "ramda"; //eslint-disable-line id-length
import { WRITE_A_STORY } from "./../../header/HeaderActions";

export class DisplayCollectionFeeds extends Component {
    constructor() {
        super();
        this.hasMoreFeeds = true;
        this.offset = 0;
        this.getMoreFeeds = this.getMoreFeeds.bind(this);
    }

    componentWillMount() {
        this.getMoreFeedsCallback(this.props.collectionName);
    }

    componentDidMount() {
        window.scrollTo(0, 0); //eslint-disable-line no-magic-numbers
        this.dom = ReactDOM.findDOMNode(this);
        this.dom.addEventListener("scroll", this.getMoreFeeds);
        this.props.dispatch(displayArticle());
    }

    componentWillReceiveProps(nextProps) {
        if(this.props.collectionName !== nextProps.collectionName) {
            this.hasMoreFeeds = true;
            this.offset = 0;
            this.props.dispatch(clearFeeds());
            this.getMoreFeedsCallback(nextProps.collectionName);
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
                if (Math.abs(document.body.scrollHeight - (pageYOffset + innerHeight)) < 1) { //eslint-disable-line no-magic-numbers
                    this.getMoreFeedsCallback(this.props.collectionName);
                }
            }, scrollTimeInterval);
        }
    }

    getMoreFeedsCallback(collectionName) {
        let callback = (result) => {
            this.offset = result.docsLength ? (this.offset + result.docsLength) : this.offset;
            this.hasMoreFeeds = result.hasMoreFeeds;
        };

        if (this.hasMoreFeeds && !R.isEmpty(collectionName)) {
            this.props.dispatch(displayCollectionFeeds(this.offset, collectionName, callback));
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
                <DisplayArticle collection={this.refs.collection} collectionName={this.props.collectionName} />
                <div ref="collection" className="display-collection">
                    {this.displayHeader()}
                    <div className="collection-feeds">
                        {
                            this.props.feeds.map((feed, index) =>
                                <CollectionFeed feed={feed} key={index} dispatch={this.props.dispatch} tab={this.props.tab}/>)
                        }
                    </div>
                </div>
            </div>
        );
    }
}

DisplayCollectionFeeds.propTypes = {
    "collectionName": PropTypes.string.isRequired,
    "feeds": PropTypes.array.isRequired,
    "dispatch": PropTypes.func.isRequired,
    "tab": PropTypes.string,
    "isClicked": PropTypes.func
};

function mapToStore(store) {
    return {
        "feeds": store.displayCollection,
        "collectionName": store.currentCollection
    };
}
export default connect(mapToStore)(DisplayCollectionFeeds);
