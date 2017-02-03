import React, { Component, PropTypes } from "react";
import DateTimeUtil from "../../utils/DateTimeUtil";
import getHtmlContent from "../../utils/HtmContent";

export default class Collection extends Component {
    render() {
        const feed = this.props.feed;
        return (<div className={this.props.active ? "collection-feed active" : "collection-feed"} onClick={this.props.toggle}>

            <div className="collection-feed__title">{feed.title}</div>

            <div className="collection-feed__source">
                <div className="source-type">
                    <i className={`fa fa-${feed.sourceType}`}/>
                </div>
                <div className="source">{`${[feed.tags]} |`}</div>
                <div className="date">{DateTimeUtil.getLocalTime(feed.pubDate)}</div>
            </div>

            <div className="collection-feed__description">{getHtmlContent(feed.description)}</div>

        </div>);
    }
}

Collection.propTypes = {
    "feed": PropTypes.object.isRequired,
    "active": PropTypes.bool,
    "toggle": PropTypes.func
};
