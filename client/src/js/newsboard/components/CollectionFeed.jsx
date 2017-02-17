/* eslint brace-style:0  no-unused-expressions:0*/
import React, { Component, PropTypes } from "react";
import DateTimeUtil from "../../utils/DateTimeUtil";
import getHtmlContent from "../../utils/HtmContent";
import { displayArticle } from "./../actions/DisplayFeedActions";
import { WRITE_A_STORY } from "./../../header/HeaderActions";

export default class CollectionFeed extends Component {

    _displayArticle() {
        this.props.dispatch(displayArticle(this.props.feed));
    }

    render() {
        const feed = this.props.feed;
        let [video] = feed.videos || [];
        let [image] = feed.images;
        let style = {};
        this.props.tab === WRITE_A_STORY ? style = { "flexBasis": "100%" } : style;

        return (
            <div style={style} className="collection-feed">
                <div className="collection-feed__title">{feed.title}</div>

                <div className="collection-feed__source">
                    <div className="source-type">
                        <i className={`fa fa-${feed.sourceType}`}/>
                    </div>
                    <div className="source">{`${[feed.tags]} |`}</div>
                    <div className="date">{DateTimeUtil.getLocalTime(feed.pubDate)}</div>
                </div>

                <div className="collection-feed__description">{getHtmlContent(feed.description)}</div>

                {feed.sourceType === "web" || video || image
                    ? <button className="collection-feed__readmore" onClick={() => { this._displayArticle(); }}>Read more ></button> : ""}
            </div>);
    }
}

CollectionFeed.propTypes = {
    "feed": PropTypes.object.isRequired,
    "dispatch": PropTypes.func,
    "tab": PropTypes.string
};
