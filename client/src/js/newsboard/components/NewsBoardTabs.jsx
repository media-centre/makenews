import React, { Component, PropTypes } from "react";
import { connect } from "react-redux";
import NewsBoardTab from "./NewsBoardTab";
import { newsBoardSourceTypes } from "./../../utils/Constants";
import { hideBookmarkToast } from "./../actions/DisplayFeedActions";

export class NewsBoardTabs extends Component {
    render() {
        return (
            <div>
                <NewsBoardTab sourceIcon="line-chart" title="trending feeds" sourceType={newsBoardSourceTypes.trending}/>
                <NewsBoardTab sourceIcon="globe" title="web feeds" sourceType={newsBoardSourceTypes.web}/>
                <NewsBoardTab sourceIcon="facebook-square" title="facebook feeds" sourceType={newsBoardSourceTypes.facebook}/>
                <NewsBoardTab sourceIcon="twitter" title="twitter feeds" sourceType={newsBoardSourceTypes.twitter}/>
                <NewsBoardTab sourceIcon="bookmark" title="bookmarked items" sourceType={newsBoardSourceTypes.bookmark}>
                    <div className={this.props.displayFeedsToast.bookmark ? "toast show" : "toast"}>
                        <i className="icon fa fa-bookmark" /> &nbsp; Successfully bookmarked
                        <span className="close" onClick={() => this.props.dispatch(hideBookmarkToast())}>&times;</span>
                    </div>
                </NewsBoardTab>
                <NewsBoardTab sourceIcon="folder" title="collections" sourceType={newsBoardSourceTypes.collection}/>
            </div>
        );
    }
}

NewsBoardTabs.propTypes = {
    "displayFeedsToast": PropTypes.object,
    "dispatch": PropTypes.func
};

function mapToStore(store) {
    return {
        "displayFeedsToast": store.displayFeedsToast
    };
}

export default connect(mapToStore)(NewsBoardTabs);
