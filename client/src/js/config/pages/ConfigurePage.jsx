"use strict";
import React, { Component, PropTypes } from "react";

export default class ConfigurePage extends Component {

    componentWillMount() {
        window.scrollTo(0, 0);
    }

    render() {
        return (<div>{this.props.children}</div>);
    }
}

ConfigurePage.displayName = "ConfigurePage";
ConfigurePage.propTypes = {
    "children": PropTypes.node.isRequired
};
