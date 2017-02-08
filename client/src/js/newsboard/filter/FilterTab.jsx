/* eslint brace-style:0*/
import React, { Component, PropTypes } from "react";
import { connect } from "react-redux";
import { filterTabSwitch } from "./FilterActions";

export class FilterTab extends Component {

    displayConfiguredSources(sourceType) {
        this.props.dispatch(filterTabSwitch(sourceType));
    }

    render() {
        return (
            <div className={this.props.currentFilter === this.props.sourceType ? "news-board-tab active" : "news-board-tab"}
                onClick={() => { this.displayConfiguredSources(this.props.sourceType); }}
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
