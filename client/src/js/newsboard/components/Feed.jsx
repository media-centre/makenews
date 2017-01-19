import React, { Component, PropTypes } from "react";
import DateTimeUtil from "../../utils/DateTimeUtil";
import getHtmlContent from "../../utils/HtmContent";
import { displayArticle } from "./../actions/DisplayFeedActions";

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
        const feed = this.props.feed;
        
        return (
            <div className={this.props.active ? "feed feed--highlight" : "feed"} onClick={() => this.props.dispatch(displayArticle(feed))}>
                <div className="feed__media">{this.getMedia()}</div>

                <div className="feed__content">
                    <div className="feed__title">{feed.title}</div>
                    <div className="feed__description">{getHtmlContent(feed.description)}</div>
                </div>
                
                <div className="feed__source">
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
    "dispatch": PropTypes.func
};
