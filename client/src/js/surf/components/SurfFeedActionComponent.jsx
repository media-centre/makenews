"use strict";
import React, { Component, PropTypes } from "react";

export default class SurfFeedActionComponent extends Component {
    render() {
        return (
            <div className="park-images right" onClick={this.props.parkFeed}> <i className="fa fa-share"></i> </div>
        );
    }
}
SurfFeedActionComponent.displayName = "SurfFeedActionComponent";

SurfFeedActionComponent.propTypes = {
    "parkFeed": PropTypes.func.isRequired
};
