"use strict";
import React, { Component, PropTypes } from "react";
import AllFeeds from "../components/AllFeeds.jsx";
import { displayAllFeedsAsync } from "../actions/AllFeedsActions.js";
import { connect } from "react-redux";

export default class SurfPage extends Component {
    componentWillMount() {
        window.scrollTo(0, 0);
        this.props.dispatch(displayAllFeedsAsync());

    }

    render() {
        return (
            <div className="surf-page">
                <AllFeeds feeds={this.props.allFeeds.feeds}/>
            </div>
        );
    }
}

SurfPage.displayName = "SurfPage";

SurfPage.propTypes = {
    "dispatch": PropTypes.func.isRequired,
    "categories": PropTypes.array,
    "allFeeds": PropTypes.array
};

SurfPage.defaultProps = {
    "allFeeds": {
        "feeds": [
            {
                "type": "description",
                "feedType": "rss",
                "name": "Sports",
                "tags": [],
                "content": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua." +
                " Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat." +
                " Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur." +
                " Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum"
            },
            {
                "type": "gallery",
                "feedType": "rss",
                "name": "Sports",
                "tags": ["Date time stamp", "The Hindu"],
                "images": [{
                    "url": "images/tree4.jpg", "name": "image1"
                }, {
                    "url": "images/tree2.jpg",
                    "name": "image1"
                }, {
                    "url": "images/tree4.jpg", "name": "image1"
                }, {
                    "url": "images/tree2.jpg", "name": "image1"
                }],
                "content": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
            },
            {
                "type": "imagecontent",
                "feedType": "facebook",
                "name": "Travel",
                "tags": [],
                "url": "images/youtube.jpg",
                "content": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua." +
                " Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat." +
                " Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur." +
                " Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum"
            },
            {
                "type": "description",
                "feedType": "twitter",
                "name": "Entertainment",
                "tags": [],
                "content": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua." +
                " Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat." +
                " Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur." +
                " Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum"
            },
            {
                "type": "description",
                "feedType": "rss",
                "name": "Sports",
                "tags": [],
                "content": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua." +
                " Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat." +
                " Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur." +
                " Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum"
            }
        ]
    }
};

function select(store) {
    return store.allFeeds;
}
export default connect(select)(SurfPage);
