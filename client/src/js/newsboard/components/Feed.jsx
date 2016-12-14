import React, { Component, PropTypes } from "react";
import DateTimeUtil from "../../utils/DateTimeUtil";
import getHtmlContent from "../../utils/HtmContent";

export default class Feed extends Component {
    getMedia() {
        let media = null;
        if(this.props.feed.videos[0]) {
            media = <i className="fa fa-youtube-play" />;
        } else if (this.props.feed.images[0]) {
            media = <img src={this.props.feed.images[0].url}/>;
        }
        return media;
    }
    render() {
        let feed = this.props.feed;
        return (<div className={this.props.active ? "feed-highlight" : "feed"} onClick={this.props.onToggle}>
            <div className={this.getMedia() === null ? "feed-content-withOutEnclosure " : "feed-content-withEnclosure"}>
                <div className="feed-title">{feed.title}</div>
                <div className="feed-description">{getHtmlContent(feed.description)}</div>

            </div>
            <div className="feed-media">{this.getMedia()}</div>
            <div className="feed-source">
                <div className="source-type">{feed.sourceType === "rss" ? <i className="fa fa-globe"/> : <i className={"fa fa-" + feed.sourceType }/>}</div>
                <div className="source">{feed.tags[0]}</div>
                <div className="date">{DateTimeUtil.getLocalTime(feed.pubDate)}</div>

            </div>
        </div>);
    }
}


Feed.propTypes = {
    "active": PropTypes.bool,
    "feed": PropTypes.object.isRequired,
    "onToggle": PropTypes.func
};
