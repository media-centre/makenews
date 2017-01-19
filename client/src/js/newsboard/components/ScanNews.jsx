/* eslint react/jsx-no-literals:0 */
import { setCurrentHeaderTab } from "./../../header/HeaderActions";
import DisplayFeeds from "./DisplayFeeds";
import DisplayArticle from "./DisplayArticle";
import NewsBoardTabs from "./NewsBoardTabs";
import React, { Component, PropTypes } from "react";
import { connect } from "react-redux";

export class ScanNews extends Component {
    componentWillMount() {
        this.props.dispatch(setCurrentHeaderTab("Scan News"));
    }

    render() {
        return(
            <div className="news-board-container">
                <NewsBoardTabs />
                <DisplayFeeds />
                <DisplayArticle />
            </div>
        );
    }
}

ScanNews.propTypes = {
    "dispatch": PropTypes.func.isRequired,
    "currentTab": PropTypes.string.isRequired
};

function select(store) {
    return {
        "currentTab": store.newsBoardCurrentSourceTab
    };
}

export default connect(select)(ScanNews);
