import React, { Component, PropTypes } from "react";
import DateTimeUtil from "../../utils/DateTimeUtil";
import getHtmlContent from "../../utils/HtmContent";

export default class Feed extends Component {
    getMedia() {
        let media = null;
        //let { videos, images } = this.props.feed;
        //let [video] = videos;
        //let [image] = images;
        //if(video) {
        //    media = <i className="fa fa-youtube-play" />;
        //} else if (image) {
        //    media = <img src={image.url}/>;
        //}
        return media;
    }
    render() {
        let feed = this.props.feed;
        return (<div className={this.props.active ? "feed-highlight" : "feed"} onClick={this.props.onToggle}>
            <div className={this.getMedia() ? "feed-content-withEnclosure " : "feed-content-withOutEnclosure"}>
                <div className="feed-title">{feed.title}</div>
                <div className="feed-description">{getHtmlContent(feed.description)}</div>

            </div>
            <div className="feed-media">{this.getMedia()}</div>
            <div className="feed-source">
                <div className="source-type">{feed.sourceType === "rss" ? <i className="fa fa-globe"/> : <i className={"fa fa-" + feed.sourceType}/>}</div>
                <div className="source">{[feed.tags]}</div>
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
