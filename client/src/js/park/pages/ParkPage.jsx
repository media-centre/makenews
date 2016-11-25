import React, { Component, PropTypes } from "react";
import AllFeeds from "../../surf/components/AllFeeds";
import { unparkFeedAsync, displayParkedFeedsAsync } from "../actions/ParkActions";
import { highLightTabAction } from "../../tabs/TabActions";
import ParkFeedActionComponent from "../components/ParkFeedActionComponent";
import { initialiseParkedFeedsCount } from "../../feeds/actions/FeedsActions";
import { connect } from "react-redux";
import Toast from "../../utils/custom_templates/Toast";

export class ParkPage extends Component {
    componentWillMount() {
        window.scrollTo(0, 0); //eslint-disable-line no-magic-numbers
        this.props.dispatch(highLightTabAction(["Park"]));
        this.props.dispatch(initialiseParkedFeedsCount());
        this.props.dispatch(displayParkedFeedsAsync());
    }

    parkClickHandler(feedDoc) {
        this.props.dispatch(unparkFeedAsync(feedDoc, () => {
            Toast.show(this.props.messages.feeds.feedDeletionSuccess);
        }));
    }

    getHintMessage() {
        if(!this.props.parkedItems) {
            return <div ref="defaultText" className="t-center">{this.props.messages.fetchingFeeds}</div>;
        } else if (this.props.parkedItems.length === 0) { //eslint-disable-line no-magic-numbers
            return <div ref="defaultText" className="t-center">{this.props.messages.noFeeds}</div>;
        }
        return null;
    }

    render() {
        return (
            <div ref="parkItem" className="park-page">
                <div className="feeds-container">
                    {this.getHintMessage()}
                    <AllFeeds feeds={this.props.parkedItems} dispatch={this.props.dispatch} actionComponent={ParkFeedActionComponent} clickHandler={(feedDoc) => this.parkClickHandler(feedDoc)}/>
                </div>
            </div>
        );
    }

}

ParkPage.displayName = "ParkPage";

ParkPage.propTypes = {
    "dispatch": PropTypes.func,
    "parkedItems": PropTypes.array,
    "messages": PropTypes.object
};

ParkPage.defaultType = {
};

function select(store) {
    return store.parkedFeeds;
}
export default connect(select)(ParkPage);
