import { setCurrentHeaderTab } from "./../../header/HeaderActions";
import DisplayFeeds from "./DisplayFeeds";
import DisplayArticle from "./DisplayArticle";
import DisplayCollectionFeeds from "./DisplayCollectionFeeds";
import NewsBoardTabs from "./NewsBoardTabs";
import { newsBoardSourceTypes, IS_MOBILE } from "./../../utils/Constants";
import FilterTabs from "../filter/FilterTabs";
import { filterTabSwitch } from "../filter/FilterActions";
import DisplayFilters from "../filter/DisplayFilters";
import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Locale from "./../../utils/Locale";
import FeedContainer from "./FeedContainer";

export class ScanNews extends Component {

    constructor() {
        super();
        this.filterCallBack = this.filterCallBack.bind(this);
        this.displayFilters = this.displayFilters.bind(this);
        this._navBarRef = this._navBarRef.bind(this);
    }

    componentWillMount() {
        const mainHeaderStrings = Locale.applicationStrings().messages.mainHeaderStrings;
        this.props.dispatch(setCurrentHeaderTab(mainHeaderStrings.newsBoard));
    }

    displayFilters() {
        this.props.dispatch(filterTabSwitch(this.props.currentTab));
    }

    filterCallBack() {
        this.props.dispatch(filterTabSwitch(""));
    }

    _navBarRef() {
        return this.refs.scanNewsNavBar;
    }

    render() {
        if(this.props.currentFilter !== "") {
            return(
                <div className="news-board-container">
                    <FilterTabs callback={this.filterCallBack} currentTab = {this.props.currentTab} />
                    <DisplayFilters />
                </div>
            );
        }

        return(
            <div className="news-board-container">
                <div className="source-type-bar" ref="scanNewsNavBar">
                    <div onClick={this.displayFilters} className="source-filter news-board-tab">
                        <i className="icon fa fa-filter"/>
                    </div>
                    <NewsBoardTabs />
                </div>
                { IS_MOBILE ? <FeedContainer navBar={this._navBarRef} tab={this.props.currentTab} toolBar/>
                    : <div className="feed-article-container">
                        <DisplayFeeds />
                        {this.props.currentTab === newsBoardSourceTypes.collection ? <DisplayCollectionFeeds /> : <DisplayArticle toolBar />}
                    </div>}
            </div>
        );
    }
}

ScanNews.propTypes = {
    "dispatch": PropTypes.func.isRequired,
    "currentTab": PropTypes.string.isRequired,
    "currentFilter": PropTypes.string.isRequired
};

function select(store) {
    return {
        "currentTab": store.newsBoardCurrentSourceTab,
        "currentFilter": store.currentFilter
    };
}

export default connect(select)(ScanNews);
