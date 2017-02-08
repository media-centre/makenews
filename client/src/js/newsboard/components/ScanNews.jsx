/* eslint react/jsx-no-literals:0 */
import { setCurrentHeaderTab } from "./../../header/HeaderActions";
import DisplayFeeds from "./DisplayFeeds";
import DisplayArticle from "./DisplayArticle";
import DisplayCollection from "./DisplayCollectionFeeds";
import NewsBoardTabs from "./NewsBoardTabs";
import { newsBoardSourceTypes } from "./../../utils/Constants";
import FilterTabs from "../filter/FilterTabs";
import { filterTabSwitch } from "../filter/FilterActions";
import DisplayFilters from "../filter/DisplayFilters";
import React, { Component, PropTypes } from "react";
import { connect } from "react-redux";

export class ScanNews extends Component {

    componentWillMount() {
        this.props.dispatch(setCurrentHeaderTab("Scan News"));
    }

    renderFilter() {
        this.props.dispatch(filterTabSwitch(this.props.currentTab));
    }

    getTabs() {
        if (this.props.currentFilter !== "") {
            return <FilterTabs />;
        }
        return <NewsBoardTabs />;
    }
    
    render() {
        if(this.props.currentFilter !== "") {
            return(
                <div className="news-board-container">
                    <div className="source-type-bar">
                        <div className="source-filter news-board-tab">
                            <i className="icon fa fa-filter"/>
                        </div>
                        <FilterTabs currentTab = {this.props.currentTab} />
                    </div>
                    <div className="configure-container">
                        <DisplayFilters callback={() => this.hideFilter()} />
                    </div>
                </div>
            );
        }

        return(
            <div className="news-board-container">
                <div className="source-type-bar">
                    <div onClick={()=> this.renderFilter()} className="source-filter news-board-tab">
                        <i className="icon fa fa-filter"/>
                    </div>
                    <NewsBoardTabs />
                </div>
                <DisplayFeeds />
                {this.props.currentTab === newsBoardSourceTypes.collection ? <DisplayCollection /> : <DisplayArticle />}
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
