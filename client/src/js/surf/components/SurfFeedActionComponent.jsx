"use strict";
import React, { Component, PropTypes } from "react";

export default class SurfFeedActionComponent extends Component {
    render() {
        return (
            <ul className="feed-actions right clear-fix" onClick={this.props.feedAction}><li className="left" title="Park this feed"><i className="fa fa-share"></i></li></ul>
        );
    }
}
SurfFeedActionComponent.displayName = "SurfFeedActionComponent";

SurfFeedActionComponent.propTypes = {
    "feedAction": PropTypes.func.isRequired
};
