import React, { Component, PropTypes } from "react";
import { newsBoardSourceTypes, icons } from "./../../utils/Constants";
import FilterTab from "./FilterTab";

export default class FilterTabs extends Component {

    render() {
        if(icons[this.props.currentTab]) {
            return (
                <div className="source-type-bar">
                    <FilterTab sourceIcon={icons[this.props.currentTab]} sourceType={this.props.currentTab} />
                </div>
            );
        }
        return (
            <div className="source-type-bar">
                <FilterTab sourceIcon={icons[newsBoardSourceTypes.web]} sourceType={newsBoardSourceTypes.web}/>
                <FilterTab sourceIcon={icons[newsBoardSourceTypes.facebook]} sourceType={newsBoardSourceTypes.facebook}/>
                <FilterTab sourceIcon={icons[newsBoardSourceTypes.twitter]} sourceType={newsBoardSourceTypes.twitter}/>
            </div>
        );
    }
}

FilterTabs.propTypes = {
    "currentTab": PropTypes.string.isRequired
};

