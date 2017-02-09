import React, { Component, PropTypes } from "react";
import { connect } from "react-redux";
import ReactDOM from "react-dom";
import DisplayArticle from "./DisplayArticle";
import CollectionFeed from "./CollectionFeed";
import { displayCollectionFeeds, clearFeeds } from "./../actions/DisplayCollectionActions";
import { displayArticle } from "./../actions/DisplayFeedActions";
import R from "ramda"; //eslint-disable-line id-length

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

    render() {
        return (
            <div className="collections">
                <DisplayArticle collection={this.refs.collection}/>
                <div ref="collection" className="display-collection">
                    <header className="collection-header" />
                    <div className="collection-feeds">
                        {
                            this.props.feeds.map((feed, index) =>
                                <CollectionFeed feed={feed} key={index} dispatch={this.props.dispatch}/>)
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
    "dispatch": PropTypes.func.isRequired
};

function mapToStore(store) {
    return {
        "feeds": store.displayCollection,
        "collectionName": store.currentCollection
    };
}
export default connect(mapToStore)(DisplayCollectionFeeds);
