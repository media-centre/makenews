import React, { Component, PropTypes } from "react";
import R from "ramda"; //eslint-disable-line id-length
import Source from "./Source";

export default class SourcesResults extends Component {

    _renderResults() {
        let mappedIndex = R.addIndex(R.map);
        return mappedIndex((source, index) => <Source key={index} source={source} dispatch={this.props.dispatch} />, this.props.sources);
    }

    render() {
        return (
            <div className="sources-suggestions">
                <button> {"Add All"} </button>
                <div className="source-results">
                    { this._renderResults() }
                </div>
            </div>
        );
    }
}

SourcesResults.propTypes = {
    "sources": PropTypes.array.isRequired,
    "dispatch": PropTypes.func.isRequired
};
