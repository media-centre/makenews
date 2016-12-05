import React, { Component, PropTypes } from "react";
import Feed from "./Feed.jsx";

export default class DisplayFeeds extends Component {
    constructor() {
        super();
        this.state = { "activeIndex": 0 };
    }

    feedsDisplay() {
        let active = this.state.activeIndex;
        return this.props.feeds.map((feed, index) => {
            return (<Feed feed={feed} active={index === active} onToggle={this.handleToggle.bind(this, index)}/>);
        });
    }

    handleToggle(index) {
        this.setState({ "activeIndex": index });
    }

    render() {
        return (<div className="feeds-display">
            {this.feedsDisplay()}
        </div>);
    }
}

DisplayFeeds.propTypes = {
    "feeds": PropTypes.array.isRequired
};
