import React, { Component, PropTypes } from "react";
import { connect } from "react-redux";
import CollectionFeed from "./CollectionFeed";
import { displayCollectionFeeds } from "./../actions/DisplayCollectionActions";

export class DisplayCollectionFeeds extends Component {
    constructor() {
        super();
        this.state = { "activeIndex": 0 };
        this.hasMoreFeeds = true;
        this.offset = 0;
        this.getMoreFeeds = this.getMoreFeeds.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        if(this.props.collectionName !== nextProps.collectionName) {
            this.props.dispatch(displayCollectionFeeds(nextProps.collectionName));
        }
    }

    toggleFeed(index) {
        this.setState({ "activeIndex": index });
    }

    getMoreFeeds() {
        this.props.dispatch(displayCollectionFeeds(this.props.collectionName));
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
