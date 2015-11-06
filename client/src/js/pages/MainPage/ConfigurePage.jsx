"use strict";
import React, { Component } from "react";

export default class ConfigurePage extends Component {
    render() {
        return (<div>{this.props.children}</div>);
    }
}

ConfigurePage.displayName = "ConfigurePage";
