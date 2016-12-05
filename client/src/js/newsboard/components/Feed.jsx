import React, { Component, PropTypes } from "react";

export default class Feed extends Component {
    render() {
        return (<div className="feed">
            <div className={this.props.active ? "feed-select-title" : "feed-title"} onClick={this.props.onToggle}>{this.props.feed.title}</div>
            <div className="feed-description" onClick={this.props.onToggle}>{this.props.feed.description}</div>
            <div className="feed-source">
                <div className="source-type">{this.props.feed.sourceType}</div>
                <div className="source">{this.props.feed.tags[0]}</div>
                <div className="date">{this.props.feed.pubDate}</div>
            </div>

        </div>);
    }
}

Feed.propTypes = {
    "active": PropTypes.bool,
    "feed": PropTypes.object.isRequired,
    "onToggle": PropTypes.func
};
