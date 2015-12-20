"use strict";
import React, { Component } from "react";

export default class FeedActionComponent extends Component {
    render() {
        return (
            <div className="feed-action right">
                <img ref="image" src={"images/revert.png"}/>
            </div>
        );
    }
}
FeedActionComponent.displayName = "FeedActionComponent";
