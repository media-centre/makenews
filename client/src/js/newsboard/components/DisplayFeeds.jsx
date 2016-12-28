import React, { Component, PropTypes } from "react";
import ReactDOM from "react-dom";
import Feed from "./Feed.jsx";
import { connect } from "react-redux";
import * as DisplayFeedActions from "../actions/DisplayFeedActions";

export class DisplayFeeds extends Component {
    constructor() {
        super();
        this.state = { "activeIndex": 0, "lastIndex": 0 };
        this.hasMoreFeeds = true;
        this.getMoreFeeds = this.getMoreFeeds.bind(this);
    }

    componentDidMount() {
        window.scrollTo(0, 0); //eslint-disable-line no-magic-numbers
        ReactDOM.findDOMNode(this).addEventListener("scroll", this.getFeedsCallBack.bind(this));
        this.getMoreFeeds(this.props.sourceType);
    }

    componentWillReceiveProps(nextProps) {
        if(this.props.sourceType !== nextProps.sourceType) {
            this.hasMoreFeeds = true;
            this.getMoreFeeds(nextProps.sourceType);
            let data = DisplayFeedActions.clearFeeds();
            this.props.dispatch(data);
        }
    }

    componentWillUnmount() {
        ReactDOM.findDOMNode(this).removeEventListener("scroll", this.getFeedsCallBack);
    }

    getFeedsCallBack() {
        if (!this.timer) {
            const scrollTimeInterval = 250;
            this.timer = setTimeout(() => {
                this.timer = null;
                if (Math.abs(document.body.scrollHeight - (pageYOffset + innerHeight)) < 1) { //eslint-disable-line no-magic-numbers
                    this.getMoreFeeds(this.props.sourceType);
                }
            }, scrollTimeInterval);
        }
    }

    getMoreFeeds(sourceType) {
        if (this.hasMoreFeeds) {
            this.props.dispatch(DisplayFeedActions.displayFeedsByPage(this.state.lastIndex, sourceType, (result) => {
                let skip = result.docsLength ? this.state.lastIndex : (this.state.lastIndex + result.docsLength);
                this.hasMoreFeeds = result.hasMoreFeeds;
                this.setState({ "lastIndex": skip });
            }));
        }
    }

    handleToggle(index) {
        this.setState({ "activeIndex": index });
    }

    refreshFeeds() {
        DisplayFeedActions.fetchFeedsFromSources();
    }

    render() {
        return (
            <div className="configured-feeds-container">
                <button onClick={this.refreshFeeds()} className="refresh-button">{"Refresh"}</button>
                {this.props.feeds.map((feed, index) =>
                    <Feed feed={feed} key={index} active={index === this.state.activeIndex} selectFeedHandler={this.handleToggle.bind(this, index)}/>)}
            </div>
        );
    }
}

function mapToStore(store) {
    return {
        "feeds": store.fetchedFeeds,
        "sourceType": store.newsBoardCurrentSourceTab
    };
}

DisplayFeeds.propTypes = {
    "dispatch": PropTypes.func.isRequired,
    "feeds": PropTypes.array.isRequired,
    "sourceType": PropTypes.string.isRequired
};

export default connect(mapToStore)(DisplayFeeds);
