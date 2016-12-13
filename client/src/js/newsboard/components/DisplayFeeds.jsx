import React, { Component, PropTypes } from "react";
import Feed from "./Feed.jsx";
import { connect } from "react-redux";
import { displayAllConfiguredFeeds, displayFeedsByPage } from "../actions/DisplayFeedActions";
import Toast from "../../utils/custom_templates/Toast";
const MAX_FEEDS_PER_REQUEST = 25;

export class DisplayFeeds extends Component {
    constructor() {
        super();
        this.state = { "activeIndex": 0, "lastIndex": 0, "showPaginationSpinner": false, "hasMoreFeeds": true };
    }

    componentWillMount() {
        this.props.dispatch(displayAllConfiguredFeeds());
        this.paginateFeeds();
    }

    paginateFeeds() {
        // document.addEventListener("scroll", () => this.getFeedsCallBack());
        document.addEventListener("scroll", () => setTimeout(this.getMoreFeeds(), 4000));
    }

    getFeedsCallBack() {
        if (Math.abs(document.body.scrollHeight - (pageYOffset + innerHeight)) < 1) { //eslint-disable-line no-magic-numbers
            this.getMoreFeeds();
        }
    }

    getMoreFeeds() {
        //if(!this._reactInternalInstance) {
        //    console.log("first if in getmoreFeeds");
        //    return;
        //}
        console.log("get more feeds");
        if (!this.state.hasMoreFeeds) {
            Toast.show("No more feeds");
            return;
        }

        if (!this.state.showPaginationSpinner) {
            console.log("in pagination spinner if");
            //    console.log("third if in getmoreFeeds");
            this.setState({ "showPaginationSpinner": true });
            this.setState({ "lastIndex": this.state.lastIndex + MAX_FEEDS_PER_REQUEST });
            let some = this.props.dispatch(displayFeedsByPage(this.state.lastIndex));
            console.log("some========>", some);
            //     , () => {
            //     console.log("no more feeds");
            //     this.setState({ "hasMoreFeeds": false, "showPaginationSpinner": false });
            //     Toast.show("No more feeds");
            // });
        }
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
