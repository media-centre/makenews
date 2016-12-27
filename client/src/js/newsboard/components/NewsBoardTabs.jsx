import React, { Component } from "react";
import NewsBoardTab from "./NewsBoardTab";
import { newsBoardSourceTypes } from "./../../utils/Constants";

export default class NewsBoardTabs extends Component {
    render() {
        return (
            <div className="source-type-bar">
                <NewsBoardTab sourceIcon="line-chart" sourceType={newsBoardSourceTypes.trending}/>
                <NewsBoardTab sourceIcon="globe" sourceType={newsBoardSourceTypes.web}/>
                <NewsBoardTab sourceIcon="facebook-square" sourceType={newsBoardSourceTypes.facebook}/>
                <NewsBoardTab sourceIcon="twitter" sourceType={newsBoardSourceTypes.twitter}/>
            </div>
        );
    }
}
