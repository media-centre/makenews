import React, { Component } from "react";
import PropTypes from "prop-types";
import DisplayArticle from "./DisplayArticle";
import DisplayFeeds from "./DisplayFeeds";

export default class FeedContainer extends Component {

    constructor() {
        super();
        this.state = { "isFeedSelected": false };
        this.feedCallback = this.feedCallback.bind(this);
        this.articleCallback = this.articleCallback.bind(this);
    }

    articleCallback() {
        this.invertSelection();
        this.refs.storyFeedsDOM.style.display = "block";
        this.props.navBar().style.display = "block";
    }

    feedCallback() {
        this.invertSelection();
        this.refs.storyFeedsDOM.style.display = "none";
        this.props.navBar().style.display = "none";
    }

    invertSelection() {
        this.setState({ "isFeedSelected": !this.state.isFeedSelected });
    }

    render() {
        return (<div className="configured-feeds-container">
            {this.state.isFeedSelected &&
                <DisplayArticle feedCallback={this.articleCallback}
                    toolBar = {this.props.toolBar}
                />}
            <div ref="storyFeedsDOM">
                <DisplayFeeds feedCallback={this.feedCallback} />
            </div>
        </div>
        );
    }

}

FeedContainer.propTypes = {
    "currentTab": PropTypes.string,
    "toolBar": PropTypes.bool,
    "navBar": PropTypes.string
};
