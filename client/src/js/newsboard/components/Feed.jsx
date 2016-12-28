import React, { Component, PropTypes } from "react";
import DateTimeUtil from "../../utils/DateTimeUtil";
import getHtmlContent from "../../utils/HtmContent";

export default class Feed extends Component {
    getMedia() {
        let [video] = this.props.feed.videos;
        let [image] = this.props.feed.images;
        if(video) {
            return <i className="fa fa-youtube-play" />;
        } else if (image) {
            return <img src={image.url}/>;
        }
        return null;
    }
    render() {
        let feed = this.props.feed;
        return (
            <div className={this.props.active ? "feed-highlight" : "feed"} onClick={this.props.selectFeedHandler}>
                <div className={this.getMedia() ? "feed-content-withEnclosure " : "feed-content-withOutEnclosure"}>
                    <div className="feed-title">{feed.title}</div>
                    <div className="feed-description">{getHtmlContent(feed.description)}</div>
                </div>
                
                <div className="feed-media">{this.getMedia()}</div>
                
                <div className="feed-source">
                    <div className="source-type">
                        <i className={feed.sourceType === "web" ? "fa fa-globe" : `fa fa-${feed.sourceType}`}/>
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
