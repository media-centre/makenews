"use strict";
import React, { Component, PropTypes } from "react";
import AllFeeds from "../../surf/components/AllFeeds.jsx";
import { displayParkedFeedsAsync  } from "../actions/ParkActions";
import { unparkFeed } from "../../feeds/actions/FeedsActions";
import { highLightTabAction } from "../../tabs/TabActions.js";
import ParkFeedActionComponent from "../components/ParkFeedActionComponent.jsx";
import { initialiseParkedFeedsCount } from "../../feeds/actions/FeedsActions.js";
import { List } from "immutable";
import { connect } from "react-redux";

export class ParkPage extends Component {
    componentWillMount() {
        window.scrollTo(0, 0);
        this.props.dispatch(highLightTabAction(["Park"]));
        this.props.dispatch(initialiseParkedFeedsCount());
        this.props.dispatch(displayParkedFeedsAsync());
    }

    parkClickHandler(feedDoc) {
        this.props.dispatch(unparkFeed(feedDoc));
    }

    render() {
        let defaultText = this.props.parkedItems.length === 0 ? <div ref="defaultText" className="t-center">{"No feeds found"}</div> : null;

        return (
            <div ref="parkItem" className="park-page feeds-container">
                {defaultText}
                <AllFeeds feeds={this.props.parkedItems} dispatch={this.props.dispatch} actionComponent={ParkFeedActionComponent} clickHandler={(feedDoc) => this.parkClickHandler(feedDoc)}/>
            </div>
        );
    }

}

ParkPage.displayName = "ParkPage";

ParkPage.propTypes = {
    "dispatch": PropTypes.func,
    "parkedItems": PropTypes.array
};

ParkPage.defaultType = {
    "parkedItems": []
};

function select(store) {
    return store.parkedFeeds;
}
export default connect(select)(ParkPage);
