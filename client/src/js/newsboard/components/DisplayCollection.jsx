import React, { Component, PropTypes } from "react";
import { connect } from "react-redux";
import Collection from "./Collection";

export class DisplayCollection extends Component {
    render() {
        return (<div className="display-collection">
            {this.props.feeds.map((feed, index) =>
                <Collection feed={feed} key={index} />)}
        </div>);
    }
}

DisplayCollection.propTypes = {
    "feeds": PropTypes.array.isRequired
};

function mapToStore(store) {
    return { "feeds": store.displayCollection };
}
export default connect(mapToStore)(DisplayCollection);
