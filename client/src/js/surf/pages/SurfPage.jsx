"use strict";
import React, { Component, PropTypes } from "react";
import AllFeeds from "../components/AllFeeds.jsx";

export default class SurfPage extends Component {
    render() {
        return (
            <div className="surf-page">
                <AllFeeds feeds={this.props.categories}/>
            </div>
        );
    }
}

SurfPage.displayName = "SurfPage";

SurfPage.propTypes = {
    "category": PropTypes.array
};

SurfPage.defaultProps = {
    "categories": [
        { "type":"description", "content": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum"},
        { "type": "gallery", "feedType": "rss", "name": "Sports", "tags": ["Date time stamp", "The Hindu"], "images": [{ "url": "images/tree4.jpg", "name": "image1" }, { "url": "images/tree2.jpg", "name": "image1" }, { "url": "images/tree4.jpg", "name": "image1"}, {"url": "images/tree2.jpg", "name": "image1" }], "content": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua." },
        { "type": "imagecontent", "feedType": "facebook", "name": "Travel", "tags": [], "url": "images/youtube.jpg", "content": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum" },
        { "type":"description", "feedType": "twitter", "name": "Entertainment", "tags": [],"content": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum"},
        { "type":"description", "feedType": "rss", "name": "Sports", "tags": [],"content": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum"}
    ]
};
