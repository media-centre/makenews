import React, { Component } from "react";
import PropTypes from "prop-types";
import NewsBoardTab from "./NewsBoardTab";
import { newsBoardSourceTypes } from "./../../utils/Constants";

export default class NewsBoardTabs extends Component {
    render() {
        return (
            <div>
                <NewsBoardTab sourceIcon="line-chart" title="trending feeds" sourceType={newsBoardSourceTypes.trending}/>
                <NewsBoardTab sourceIcon="globe" title="web feeds" sourceType={newsBoardSourceTypes.web}/>
                <NewsBoardTab sourceIcon="facebook-square" title="facebook feeds" sourceType={newsBoardSourceTypes.facebook}/>
                <NewsBoardTab sourceIcon="twitter" title="twitter feeds" sourceType={newsBoardSourceTypes.twitter}/>
                <NewsBoardTab sourceIcon="bookmark" title="bookmarked items" sourceType={newsBoardSourceTypes.bookmark} />
                <NewsBoardTab sourceIcon="folder" title="collections" sourceType={newsBoardSourceTypes.collection} />
            </div>
        );
    }
}

NewsBoardTabs.propTypes = {
    "displayFeedsToast": PropTypes.object,
    "dispatch": PropTypes.func
};
