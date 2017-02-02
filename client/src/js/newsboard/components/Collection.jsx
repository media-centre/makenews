import React, { Component, PropTypes } from "react";

export default class Collection extends Component {
    render() {
        return (<div>
            collection
        </div>);
    }
}

Collection.propTypes = {
    "feed": PropTypes.object.isRequired
};
