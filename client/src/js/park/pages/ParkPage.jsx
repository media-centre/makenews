"use strict";
import React, { Component, PropTypes } from "react";
import { highLightTabAction } from "../../tabs/TabActions.js";
import { connect } from "react-redux";

export default class ParkPage extends Component {
    componentWillMount() {
        window.scrollTo(0, 0);
        this.props.dispatch(highLightTabAction("Park"));
    }

    render() {
        return (
            <div className="park-page">
                {"Park"}
            </div>
        );
    }
}

ParkPage.displayName = "ParkPage";

ParkPage.propTypes = {
    "dispatch": PropTypes.func.isRequired
};


function select(store) {
    return store;
}
export default connect(select)(ParkPage);

