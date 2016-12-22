import React, { Component } from "react";
import NewsBoardTab from "./NewsBoardTab";
import { TRENDING, RSS, FACEBOOK, TWITTER } from "./../actions/DisplayFeedActions";

export default class NewsBoardTabs extends Component {
    render() {
        return (
            <div className="source-type-bar">
                <NewsBoardTab image="trending-icon.png" sourceType={RSS}/>
                <NewsBoardTab image="web-icon.png" sourceType={RSS}/>
                <NewsBoardTab image="facebook-icon.png" sourceType={FACEBOOK}/>
                <NewsBoardTab image="twitter-icon.png" sourceType={TWITTER}/>
            </div>
        );
    }
}
