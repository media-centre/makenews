import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { filterTabSwitch } from "./FilterActions";

export class FilterTab extends Component {
    constructor() {
        super();
        this.displayConfiguredSources = this.displayConfiguredSources.bind(this);
    }

    displayConfiguredSources() {
        this.props.dispatch(filterTabSwitch(this.props.sourceType));
    }

    render() {
        return (
            <div className={this.props.currentFilter === this.props.sourceType ? "news-board-tab active" : "news-board-tab"}
                onClick={this.displayConfiguredSources}
            >
                <i className={`icon fa fa-${this.props.sourceIcon}`} />
            </div>
        );
    }
}

function mapToStore(store) {
    return {
        "currentFilter": store.currentFilter
    };
}

FilterTab.propTypes = {
    "sourceIcon": PropTypes.string.isRequired,
    "sourceType": PropTypes.string.isRequired,
    "dispatch": PropTypes.func.isRequired,
    "currentFilter": PropTypes.string.isRequired
};

export default connect(mapToStore)(FilterTab);
