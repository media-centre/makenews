import React, { Component, PropTypes } from "react";
import { displayAllConfiguredFeeds } from "../actions/NewsBoardActions";
import { connect } from "react-redux";

class NewsBoardPage extends Component {
    componentWillMount() {
        this.props.dispatch(displayAllConfiguredFeeds());
    }

    render() {
        return (
            <div className="news-board-container">
                <div className="source-type-bar">{"Sources"}</div>
                <div className="configured-feeds-container">{"Feeds"}</div>
            </div>
        );
    }
}

NewsBoardPage.displayName = "NewsBoardPage";

function mapToStore(state) {
    return {
        //"sources": state.facebookConfiguredUrls
    };
}

NewsBoardPage.propTypes = {
    "dispatch": PropTypes.func
};

export default connect(mapToStore)(NewsBoardPage);

