"use strict";
import React, { Component } from "react";

export default class ParkFeedActionComponent extends Component {
    render() {
        return (
            <div className="feed-action right">
                <img ref="image" src={"images/revert.png"}/>
            </div>
        );
    }
}
ParkFeedActionComponent.displayName = "ParkFeedActionComponent";
