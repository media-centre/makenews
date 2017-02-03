import React, { Component, PropTypes } from "react";
import { connect } from "react-redux";
import Collection from "./CollectionFeed";

export class DisplayCollectionFeeds extends Component {
    constructor() {
        super();
        this.state = { "activeIndex": 0 };
    }

    toggleFeed(index) {
        this.setState({ "activeIndex": index });
    }

    render() {
        return (<div className="display-collection">
            <div className="collection-feeds">
                {this.props.feeds.map((feed, index) =>
                <Collection feed={feed} key={index} active={index === this.state.activeIndex} toggle = {this.toggleFeed.bind(this, index)}/>)}
            </div>
        </div>);
    }
}

DisplayCollectionFeeds.propTypes = {
    "feeds": PropTypes.array.isRequired
};

function mapToStore(store) {
    return { "feeds": store.displayCollection };
}
export default connect(mapToStore)(DisplayCollectionFeeds);
