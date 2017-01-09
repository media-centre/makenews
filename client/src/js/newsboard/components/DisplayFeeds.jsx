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
        this.dom = ReactDOM.findDOMNode(this);
        this.dom.addEventListener("scroll", this.getFeedsCallBack.bind(this));
        this.getMoreFeeds(this.props.sourceType);
    }

    componentWillReceiveProps(nextProps) {
        if(this.props.sourceType !== nextProps.sourceType) {
            this.hasMoreFeeds = true;
            this.setState({ "activeIndex": 0, "lastIndex": 0 });
            this.getMoreFeeds(nextProps.sourceType);
            this.props.dispatch(DisplayFeedActions.clearFeeds());
        }
    }

    componentWillUnmount() {
        this.dom.removeEventListener("scroll", this.getFeedsCallBack);
    }

    getFeedsCallBack() {
        if (!this.timer) {
            const scrollTimeInterval = 250;
            this.timer = setTimeout(() => {
                this.timer = null;
                const scrollTop = this.dom.scrollTop;
                if (scrollTop && scrollTop + this.dom.clientHeight >= this.dom.scrollHeight) {
                    this.getMoreFeeds(this.props.sourceType);
                }
            }, scrollTimeInterval);
        }
    }

    getMoreFeeds(sourceType) {
        if (this.hasMoreFeeds) {
            this.props.dispatch(DisplayFeedActions.displayFeedsByPage(this.state.lastIndex, sourceType, (result) => {
                let skip = result.docsLength ? (this.state.lastIndex + result.docsLength) : this.state.lastIndex;
                this.hasMoreFeeds = result.hasMoreFeeds;
                this.setState({ "lastIndex": skip });
            }));
        }
    }

    handleToggle(index) {
        this.setState({ "activeIndex": index });
    }

    render() {
        return (
            <div className="configured-feeds-container">
                <button onClick={DisplayFeedActions.fetchFeedsFromSources} className="refresh-button">{"Refresh"}</button>
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
