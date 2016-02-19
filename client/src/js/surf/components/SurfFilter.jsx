/*eslint no-nested-ternary:0, no-set-state:0 */
"use strict";
import React, { Component, PropTypes } from "react";
import SurfFilterItem from "./SurfFilterItem.jsx";

export default class SurfFilter extends Component {

    constructor(props) {
        super(props);

        this.state = { "show": false };
    }

    updateFilter(type, filterItems) {
        let filter = this.props.filter;
        if(type === "text") {
            filter.categories = filterItems;
        } else if(type === "source") {
            filter.sourceTypes = filterItems;
        } else {
            filter.mediaTypes = filterItems;
        }
        this.props.updateFilter(filter);
    }

    toggleFilter() {
        this.setState({ "show": !this.state.show });
    }

    render() {
        return (
            <div className={this.state.show ? "anim surf-filter show-filter show" : "anim surf-filter show-filter"}>
                <div className="wrapper">
                    <div className="anim show-filter-container">
                        <SurfFilterItem type="source" displayItems={this.props.sourceTypeFilter} filterItems={this.props.filter.sourceTypes} title="Source" dispatchFilterAction={this.updateFilter.bind(this)}/>
                        <SurfFilterItem type="content" displayItems={this.props.mediaTypes} filterItems={this.props.filter.mediaTypes} title="Content" dispatchFilterAction={this.updateFilter.bind(this)}/>
                        <SurfFilterItem type="text" displayItems={this.props.categories} filterItems={this.props.filter.categories} title="Categories" dispatchFilterAction={this.updateFilter.bind(this)}/>
                    </div>
                </div>
                <button id="filterToggle" onClick={this.toggleFilter.bind(this)} title="filters"><i className="fa fa-filter"></i></button>
            </div>
        );
    }
}

SurfFilter.displayName = "SurfFilter";

SurfFilter.propTypes = {
    "filter": PropTypes.object.isRequired,
    "updateFilter": PropTypes.func.isRequired,
    "categories": PropTypes.array.isRequired,
    "sourceTypeFilter": PropTypes.array.isRequired,
    "mediaTypes": PropTypes.array.isRequired
};

SurfFilter.defaultProps = {
};
