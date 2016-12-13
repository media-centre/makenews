import React, { Component, PropTypes } from "react";
import ReactDOM from "react-dom";
import Feed from "./Feed.jsx";
import { connect } from "react-redux";
import { displayFeedsByPage } from "../actions/DisplayFeedActions";
// const MAX_FEEDS_PER_REQUEST = 25;


export class DisplayFeeds extends Component {
    constructor() {
        super();
        this.state = { "activeIndex": 0, "lastIndex": 0, "hasMoreFeeds": true };
        this.getMoreFeeds = this.getMoreFeeds.bind(this);
    }

    componentDidMount() {
        window.scrollTo(0, 0); //eslint-disable-line no-magic-numbers
        ReactDOM.findDOMNode(this).addEventListener("scroll", this.getFeedsCallBack.bind(this));
        this.getMoreFeeds();
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
                    this.getMoreFeeds();
                }
            }, scrollTimeInterval);

        }
    }

    getMoreFeeds() {
        if (this.state.hasMoreFeeds) {
            this.props.dispatch(displayFeedsByPage(this.state.lastIndex, (result) => {
                let skip = result.docsLenght === 0 ? this.state.lastIndex : (this.state.lastIndex + result.docsLenght); //eslint-disable-line no-magic-numbers
                this.setState({ "lastIndex": skip, "hasMoreFeeds": result.hasMoreFeeds });
            }));
        }
    }

    feedsDisplay() {
        let active = this.state.activeIndex;
        return this.props.feeds.map((feed, index) => {
            return (<Feed feed={feed} key={index} active={index === active} onToggle={this.handleToggle.bind(this, index)}/>);

        });
    }

    handleToggle(index) {
        this.setState({ "activeIndex": index });
    }

    render() {
        return (<div className="configured-feeds-container">
            {this.feedsDisplay()}
        </div>);
    }
}

function mapToStore(store) {
    return { "feeds": store.fetchedFeeds };
}

DisplayFeeds.propTypes = {
    "dispatch": PropTypes.func.isRequired,
    "feeds": PropTypes.array.isRequired
};

export default connect(mapToStore)(DisplayFeeds);
