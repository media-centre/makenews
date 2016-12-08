/* eslint react/jsx-no-literals:0 */
import React, { Component, PropTypes } from "react";
import { setCurrentHeaderTab } from "./../../header/HeaderActions";
import { connect } from "react-redux";

export class ConfigureURLs extends Component {

    componentWillMount() {
        this.props.dispatch(setCurrentHeaderTab("Configure"));
    }

    render() {
        return (
            <div>
                <h1>Configure URL</h1>
            </div>
        );
    }
}

ConfigureURLs.propTypes = {
    "dispatch": PropTypes.func.isRequired
};

function select(store) {
    return store;
}

export default connect(select)(ConfigureURLs);

