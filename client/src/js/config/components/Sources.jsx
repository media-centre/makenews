import React, { Component, PropTypes } from "react";
import R from "ramda"; //eslint-disable-line id-length
import Source from "./Source";
import { connect } from "react-redux";

export class Sources extends Component {

    render() {
        return (
            <div className="source-results">
                { R.addIndex(R.map)(
                    (source, index) => <Source key={index} source={source} dispatch={this.props.dispatch} />,
                    this.props.sources
                ) }
            </div>
        );
    }
}

function mapToStore(store) {
    return {
        "sources": store.facebookSources
    };
}

Sources.propTypes = {
    "sources": PropTypes.array.isRequired,
    "dispatch": PropTypes.func.isRequired
};

export default connect(mapToStore)(Sources);
