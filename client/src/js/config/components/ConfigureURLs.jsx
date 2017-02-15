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
                { this.props.children }
            </div>
        );
    }
}

ConfigureURLs.propTypes = {
    "dispatch": PropTypes.func.isRequired,
    "children": PropTypes.node.isRequired,
    "params": PropTypes.object.isRequired
};

function select(store) {
    return store;
}

export default connect(select)(ConfigureURLs);
