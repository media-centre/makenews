import React, { Component, PropTypes } from "react";
import DateTimeUtil from "../../utils/DateTimeUtil";
import getHtmlContent from "../../utils/HtmContent";

export default class Feed extends Component {
    getMedia() {
        if(this.props.feed.videos && this.props.feed.videos.length) {
            return <img src={this.props.feed.videos[0].thumbnail}/>; //eslint-disable-line no-magic-numbers
        } else if (this.props.feed.images && this.props.feed.images.length) {
            return <img src={this.props.feed.images[0].url}/>; //eslint-disable-line no-magic-numbers
        }
        return null;
    }
    render() {
        let feed = this.props.feed;
        return (
            <div className={this.props.active ? "feed-highlight" : "feed"} onClick={this.props.selectFeedHandler}>
                <div className="feed-media">{this.getMedia()}</div>

                <div className="feed-content">
                    <div className="feed-title">{feed.title}</div>
                    <div className="feed-description">{getHtmlContent(feed.description)}</div>
                </div>
                
                <div className="feed-source">
                    <div className="source-type">
                        <i className={`fa fa-${feed.sourceType}`}/>
                    </div>
                    <div className="source">{[feed.tags]}</div>
                    <div className="date">{DateTimeUtil.getLocalTime(feed.pubDate)}</div>
                </div>
            </div>
        );
    }
}

Feed.propTypes = {
    "active": PropTypes.bool,
    "feed": PropTypes.object.isRequired,
    "selectFeedHandler": PropTypes.func
};
