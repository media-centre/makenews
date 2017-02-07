import React, { Component, PropTypes } from "react";
import { connect } from "react-redux";
import ReactDOM from "react-dom";
import CollectionFeed from "./CollectionFeed";
import { displayCollectionFeeds, clearFeeds } from "./../actions/DisplayCollectionActions";

export class DisplayCollectionFeeds extends Component {
    constructor() {
        super();
        this.state = { "activeIndex": 0 };
        this.hasMoreFeeds = true;
        this.offset = 0;
        this.getMoreFeeds = this.getMoreFeeds.bind(this);
    }

    componentWillMount() {
        this.props.dispatch(clearFeeds());
    }

    componentDidMount() {
        window.scrollTo(0, 0); //eslint-disable-line no-magic-numbers
        this.dom = ReactDOM.findDOMNode(this);
        this.dom.addEventListener("scroll", this.getMoreFeeds);
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

    toggleFeed(index) {
        this.setState({ "activeIndex": index });
    }

    getMoreFeedsCallback(collectionName) {
        let callback = (result) => {
            this.offset = result.docsLength ? (this.offset + result.docsLength) : this.offset;
            this.hasMoreFeeds = result.hasMoreFeeds;
        };

        if (this.hasMoreFeeds) {
            this.props.dispatch(displayCollectionFeeds(this.offset, collectionName, callback));
        }
    }

    render() {
        return (
            <div className="display-collection">
                <div className="collection-feeds">
                    {
                        this.props.feeds.map((feed, index) =>
                            <CollectionFeed feed={feed} key={index} active={index === this.state.activeIndex} toggle = {this.toggleFeed.bind(this, index)}/>)
                    }
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
