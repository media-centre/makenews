import React, { Component, PropTypes } from "react";
import DateTimeUtil from "../../utils/DateTimeUtil";
import getHtmlContent from "../../utils/HtmContent";

export default class Feed extends Component {
    render() {
        return (<div className={this.props.active ? "feed-highlight" : "feed"} onClick={this.props.onToggle}>
            <div className={this.props.feed.enclosures[0] ? "feed-content-withImg" : "feed-content-noImg"}>
                <div className="feed-title">{this.props.feed.title}</div>
                <div className="feed-description">{getHtmlContent(this.props.feed.description)}</div>

            </div>
            <div className="feed-image">{this.props.feed.enclosures[0] ? <img src={this.props.feed.enclosures[0].url}/> : null }</div>
            <div className="feed-source">
                <div className="source-type">{this.props.feed.sourceType === "rss" ? <i className="fa fa-globe"/> : <i className={"fa fa-" + this.props.feed.sourceType.toLowerCase()}/>}</div>
                <div className="source">{this.props.feed.tags[0]}</div>
                <div className="date">{DateTimeUtil.getLocalTimeFromUTC(this.props.feed.pubDate)}</div>

            </div>
        </div>);
    }
}

Feed.propTypes = {
    "active": PropTypes.bool,
    "feed": PropTypes.object.isRequired,
    "onToggle": PropTypes.func
};
