import React, { Component } from "react";
import NewsBoardTab from "./NewsBoardTab";
import { TRENDING, WEB, FACEBOOK, TWITTER } from "./../actions/DisplayFeedActions";

export default class NewsBoardTabs extends Component {
    render() {
        return (
            <div className="source-type-bar">
                <NewsBoardTab sourceIcon="line-chart" sourceType={TRENDING}/>
                <NewsBoardTab sourceIcon="globe" sourceType={WEB}/>
                <NewsBoardTab sourceIcon="facebook-square" sourceType={FACEBOOK}/>
                <NewsBoardTab sourceIcon="twitter" sourceType={TWITTER}/>
            </div>
        );
    }
}
