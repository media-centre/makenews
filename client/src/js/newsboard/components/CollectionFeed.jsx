/* eslint brace-style:0 */
import React, { Component, PropTypes } from "react";
import DateTimeUtil from "../../utils/DateTimeUtil";
import getHtmlContent from "../../utils/HtmContent";
import { displayArticle } from "./../actions/DisplayFeedActions";
import { setReadMore } from "./../actions/DisplayCollectionActions";

export default class CollectionFeed extends Component {

    _displayArticle() {
        this.props.dispatch(displayArticle(this.props.feed));
        this.props.dispatch(setReadMore(true));
    }

    render() {
        const feed = this.props.feed;
        return (
            <div className="collection-feed">
                <div className="collection-feed__title">{feed.title}</div>

                <div className="collection-feed__source">
                    <div className="source-type">
                        <i className={`fa fa-${feed.sourceType}`}/>
                    </div>
                    <div className="source">{`${[feed.tags]} |`}</div>
                    <div className="date">{DateTimeUtil.getLocalTime(feed.pubDate)}</div>
                </div>

                <div className="collection-feed__description">{getHtmlContent(feed.description)}</div>

                {feed.sourceType === "web" || feed.videos.length || feed.images.length
                    ? <button className="collection-feed__readmore" onClick={() => { this._displayArticle(); }}>Read more ></button> : ""}
            </div>);
    }
}

CollectionFeed.propTypes = {
    "feed": PropTypes.object.isRequired,
    "dispatch": PropTypes.func
};
