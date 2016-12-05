import React, { Component, PropTypes } from "react";
import { displayAllConfiguredFeeds } from "../actions/NewsBoardActions";
import { connect } from "react-redux";
import DisplayFeeds from "./DisplayFeeds";

export class NewsBoardPage extends Component {
    componentWillMount() {
        this.props.dispatch(displayAllConfiguredFeeds());
    }

    render() {
        return (
            <div className="news-board-container">
                <div className="source-type-bar">{"Sources"}</div>
                <div className="configured-feeds-container">
                    <DisplayFeeds feeds = {this.props.feeds} />
                </div>
            </div>
        );
    }
}

NewsBoardPage.displayName = "NewsBoardPage";

function mapToStore(store) {
    return { "feeds": store.fetchedFeeds };
}

NewsBoardPage.propTypes = {
    "dispatch": PropTypes.func.isRequired,
    "feeds": PropTypes.array.isRequired
};

export default connect(mapToStore)(NewsBoardPage);

