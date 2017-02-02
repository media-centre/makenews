/* eslint react/jsx-no-literals:0 */
import { setCurrentHeaderTab } from "./../../header/HeaderActions";
import DisplayFeeds from "./DisplayFeeds";
import DisplayArticle from "./DisplayArticle";
import DisplayCollection from "./DisplayCollection";
import NewsBoardTabs from "./NewsBoardTabs";
import { newsBoardSourceTypes } from "./../../utils/Constants";
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
                {this.props.currentTab === newsBoardSourceTypes.collection ? <DisplayCollection /> : <DisplayArticle />}
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
