"use strict";

import React, { Component, PropTypes } from "react";
import AllFeeds from "../components/AllFeeds.jsx";
import { displayAllFeedsAsync } from "../actions/AllFeedsActions.js";
import { connect } from "react-redux";

export default class SurfPage extends Component {
    componentWillMount() {
        window.scrollTo(0, 0);
        this.props.dispatch(displayAllFeedsAsync());

    }

    render() {
        return (
            <div className="surf-page">
                <AllFeeds feeds={this.props.feeds}/>
            </div>
        );
    }
}

SurfPage.displayName = "SurfPage";

SurfPage.propTypes = {
    "dispatch": PropTypes.func.isRequired,
    "feeds": PropTypes.array
};

SurfPage.defaultProps = {
    "feeds": []
};

function select(store) {
    return store.allFeeds;
}
export default connect(select)(SurfPage);
