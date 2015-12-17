"use strict";
import React, { Component, PropTypes } from "react";
import AllFeeds from "../../surf/components/AllFeeds.jsx";
import { displayParkedFeedsAsync } from "../actions/ParkActions";
import { highLightTabAction } from "../../tabs/TabActions.js";
import { connect } from "react-redux";

export class ParkPage extends Component {
    componentWillMount() {
        window.scrollTo(0, 0);
        this.props.dispatch(displayParkedFeedsAsync());
        this.props.dispatch(highLightTabAction(["Park"]));
    }

    render() {
        let defaultText = this.props.parkedItems.length === 0 ? <div ref="defaultText" className="t-center">{"No feeds found"}</div> : null;
        return (
            <div ref="parkItem" className="park-page">
                {defaultText}
                <AllFeeds feeds={this.props.parkedItems}/>
            </div>
        );
    }
}

ParkPage.displayName = "ParkPage";

ParkPage.propTypes = {
    "dispatch": PropTypes.func.isRequired,
    "parkedItems": PropTypes.array
};

ParkPage.defaultType = {
    "parkedItems": []
};

function select(store) {
    return store.parkedFeeds;
}
export default connect(select)(ParkPage);
