"use strict";
import React, { Component, PropTypes } from "react";
import { Link } from "react-router";

export default class ConfigureMenu extends Component {
    render() {
        return (
            <Link to="/configure/categories" activeClassName="selected">
                <div className= "configure header-link-image"></div>
                <span ref="configureTabName">{this.props.configTab.Name}</span>
            </Link>
        );
    }
}

ConfigureMenu.displayName = "ConfigureMenu";
ConfigureMenu.propTypes = {
    "configTab": PropTypes.object.isRequired
};
