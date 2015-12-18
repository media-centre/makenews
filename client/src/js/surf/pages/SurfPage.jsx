"use strict";

import React, { Component, PropTypes } from "react";
import AllFeeds from "../components/AllFeeds.jsx";
import { displayAllFeedsAsync } from "../actions/AllFeedsActions.js";
import { connect } from "react-redux";
import { highLightTabAction } from "../../tabs/TabActions.js";

export default class SurfPage extends Component {
    componentWillMount() {
        window.scrollTo(0, 0);
        this.props.dispatch(highLightTabAction(["Surf"]));
        this.props.dispatch(displayAllFeedsAsync());
    }

    render() {
        let hintMsg = this.props.feeds.length === 0 ? <div className="t-center">{"No feeds found"}</div> : null;
        return (
            <div className="surf-page feeds-container">
                {hintMsg}
                <AllFeeds feeds={this.props.feeds} dispatch={this.props.dispatch}/>
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
