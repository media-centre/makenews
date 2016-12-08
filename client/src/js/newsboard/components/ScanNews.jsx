/* eslint react/jsx-no-literals:0 */
import React, { Component, PropTypes } from "react";
import { setCurrentHeaderTab } from "./../../header/HeaderActions";
import { connect } from "react-redux";

export class ScanNews extends Component {
    componentWillMount() {
        this.props.dispatch(setCurrentHeaderTab("Scan News"));
    }

    render() {
        return (
            <div>
                <h2> Scan News </h2>
            </div>
        );
    }
}

ScanNews.propTypes = {
    "dispatch": PropTypes.func.isRequired
};

function select(store) {
    return store;
}

export default connect(select)(ScanNews);
