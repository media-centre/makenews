import React, { Component, PropTypes } from "react";

export default class ParkFeedActionComponent extends Component {
    render() {
        return (
            <ul className="feed-actions right clear-fix" onClick={this.props.feedAction}>
                <li className="left" title="Unpark this feed">
                    <i ref="reply" className="fa fa-reply"/>
                </li>
            </ul>
        );
    }
}
ParkFeedActionComponent.displayName = "ParkFeedActionComponent";

ParkFeedActionComponent.propTypes = {
    "feedAction": PropTypes.func.isRequired
};
