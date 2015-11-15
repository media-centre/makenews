"use strict";
import React, { Component, PropTypes } from "react";

export default class ConfigurePage extends Component {
    render() {
        return (<div>{this.props.children}</div>);
    }
}

ConfigurePage.displayName = "ConfigurePage";
ConfigurePage.propTypes = {
    "children": PropTypes.node.isRequired
};
