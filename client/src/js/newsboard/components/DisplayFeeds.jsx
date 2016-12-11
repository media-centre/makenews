import React, { Component, PropTypes } from "react";
import Feed from "./Feed.jsx";
import { connect } from "react-redux";
import { displayAllConfiguredFeeds, displayFeedsByPage } from "../actions/DisplayFeedActions";

export class DisplayFeeds extends Component {
    constructor() {
        super();
        this.state = {"activeIndex": 0, "lastIndex": 0, "showPaginationSpinner": false, "hasMoreFeeds": true};
    }

    componentWillMount() {
        this.props.dispatch(displayAllConfiguredFeeds());
        this.paginateFeeds();
    }

    paginateFeeds() {
        document.addEventListener("scroll", () => this.getFeedsCallBack());
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

        if (!this.state.hasMoreFeeds) {
            console.log("no feeds in getmoreFeeds");
            //Toast.show(this.props.messages.noMoreFeeds);
            return;
        }

        if (!this.state.showPaginationSpinner) {
            //    console.log("third if in getmoreFeeds");
            this.setState({ "showPaginationSpinner": true });
            this.props.dispatch(displayFeedsByPage(this.state.lastIndex));
                //, (result)=> {
                //    //    console.log("dispatch in getmorefeeds");
                //    //    result.lastIndex = result.lastIndex === 0 ? this.state.lastIndex : result.lastIndex; //eslint-disable-line no-magic-numbers
                //    //    result.hasMoreFeeds = typeof result.hasMoreFeeds === "undefined" ? true : result.hasMoreFeeds;
                //    //    this.setState({ "showPaginationSpinner": false, "lastIndex": result.lastIndex, "hasMoreFeeds": result.hasMoreFeeds });
                //    //}));
                //});
                //
                ////if(!this.state.hasMoreFeeds) {
                ////    Toast.show(this.props.messages.noMoreFeeds);
            //}));
        }
    }

    feedsDisplay() {
        let active = this.state.activeIndex;
        console.log("Displaying feeds================>", this.props.feeds)
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
