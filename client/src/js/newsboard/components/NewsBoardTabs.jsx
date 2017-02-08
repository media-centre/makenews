import React, { Component } from "react";
import NewsBoardTab from "./NewsBoardTab";
import { newsBoardSourceTypes } from "./../../utils/Constants";

export default class NewsBoardTabs extends Component {
    render() {
        return (
            <div>
                <NewsBoardTab sourceIcon="line-chart" sourceType={newsBoardSourceTypes.trending}/>
                <NewsBoardTab sourceIcon="globe" sourceType={newsBoardSourceTypes.web}/>
                <NewsBoardTab sourceIcon="facebook-square" sourceType={newsBoardSourceTypes.facebook}/>
                <NewsBoardTab sourceIcon="twitter" sourceType={newsBoardSourceTypes.twitter}/>
                <NewsBoardTab sourceIcon="bookmark" sourceType={newsBoardSourceTypes.bookmark}/>
                <NewsBoardTab sourceIcon="folder" sourceType={newsBoardSourceTypes.collection}/>
            </div>
        );
    }
}
