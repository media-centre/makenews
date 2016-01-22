"use strict";
import React, { Component, PropTypes } from "react";

export default class SurfFeedActionComponent extends Component {
    render() {
        return (
            <ul className="feed-actions right clear-fix" onClick={this.props.feedAction}><li className="left" title="Park this feed"><img className="park-feed" src="images/main/park.png" height="10px" width="10px"></img></li></ul>
        );
    }
}
SurfFeedActionComponent.displayName = "SurfFeedActionComponent";

SurfFeedActionComponent.propTypes = {
    "feedAction": PropTypes.func.isRequired
};
