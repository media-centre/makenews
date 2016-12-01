import React, { Component, PropTypes } from "react";
import { displayAllConfiguredFeeds } from "../actions/NewsBoardActions";
import { connect } from "react-redux";

class NewsBoardPage extends Component {
    //componentWillMount() {
    //    this.props.dispatch(displayAllConfiguredFeeds());
    //}

    render() {
        return (
            <div className="news-board-container">
                <div className="source-type-bar">{"Sources"}</div>
                <div className="configured-feeds-container">{"Saisree"}</div>
            </div>
        );
    }
}

NewsBoardPage.displayName = "NewsBoardPage";

function mapToStore(store) {
    return {
        "feeds": store.fetchedFeeds
    };
}

NewsBoardPage.propTypes = {
    "feeds": PropTypes.array,
    "dispatch": PropTypes.func
};

export default connect(mapToStore)(NewsBoardPage);

