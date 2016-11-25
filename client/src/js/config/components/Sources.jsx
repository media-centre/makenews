import React, { Component, PropTypes } from "react";
import R from "ramda"; //eslint-disable-line id-length
import Source from "./Source";
import { connect } from "react-redux";

export class Sources extends Component {

    _renderResults() {
        let mappedIndex = R.addIndex(R.map);
        return mappedIndex((source, index) => <Source key={index} source={source} dispatch={this.props.dispatch} />, this.props.sources);
    }

    render() {
        return (
            <div className="source-results">
                { this._renderResults() }
            </div>
        );
    }
}

function mapToStore(store) {
    return {
        "sources": store.facebookProfiles
    };
}

Sources.propTypes = {
    "sources": PropTypes.array.isRequired,
    "dispatch": PropTypes.func.isRequired
};

export default connect(mapToStore)(Sources);
