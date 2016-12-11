import React, { Component, PropTypes } from "react";
import { displayAllConfiguredFeeds } from "../actions/DisplayFeedActions";
import { connect } from "react-redux";
import DisplayFeeds from "./DisplayFeeds";

export default class NewsBoardPage extends Component {
    //componentWillMount() {
    //    this.props.dispatch(displayAllConfiguredFeeds());
    //}

    render() {
        return (
            <div className="news-board-container">
                <div className="source-type-bar">{"Sources"}</div>
                <div className="configured-feeds-container">
                    <DisplayFeeds />
                </div>
            </div>
        );
    }
}

NewsBoardPage.displayName = "NewsBoardPage";

//function mapToStore(store) {
//    return { "feeds": store.fetchedFeeds };
//}

//NewsBoardPage.propTypes = {
//    "dispatch": PropTypes.func.isRequired,
//    "feeds": PropTypes.array.isRequired
//};
//
//export default connect(mapToStore)(NewsBoardPage);

