import React, { Component } from "react";
import PropTypes from "prop-types";
import { newsBoardSourceTypes, icons } from "./../../utils/Constants";
import FilterTab from "./FilterTab";

export default class FilterTabs extends Component {

    render() {
        const filterIcon = (<div onClick = {this.props.callback} className="source-filter news-board-tab">
            <i className="icon fa fa-filter"/>
        </div>);
        if(icons[this.props.currentTab]) {
            return (
                <div className="source-type-bar">
                    {filterIcon}
                    <FilterTab sourceIcon={icons[this.props.currentTab]} sourceType={this.props.currentTab} />
                </div>
            );
        }
        return (
            <div className="source-type-bar">
                {filterIcon}
                <FilterTab sourceIcon={icons[newsBoardSourceTypes.web]} sourceType={newsBoardSourceTypes.web}/>
            </div>
        );
    }
}

FilterTabs.propTypes = {
    "currentTab": PropTypes.string.isRequired,
    "callback": PropTypes.func
};

