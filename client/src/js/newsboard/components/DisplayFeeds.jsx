import React, { Component, PropTypes } from "react";

export default class DisplayFeeds extends Component {

    feedsDisplay() {
        return this.props.feeds.map((feed) => {
            return (<div className = "feed">
               <span className="feed-title">{feed.title}</span>
               <span className="feed-description">{feed.description}</span>
               <span className="feed-type">{feed.sourceType}</span>
               <span className="feed-source">{feed.sourceUrl}</span>
           </div>);
        });
    }

    render() {
        return (<div className = "feeds-display">
            {this.feedsDisplay()}
        </div>);
    }
}

DisplayFeeds.propTypes = {
    "feeds": PropTypes.array.isRequired
};
