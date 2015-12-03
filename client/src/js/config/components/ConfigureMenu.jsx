"use strict";
import React, { Component } from "react";
import { Link } from "react-router";

export default class ConfigureMenu extends Component {
    render() {
        return (
            <Link to="/configure/categories" activeClassName="selected">
                <div className= "configure header-link-image"></div>
                <span>{"Configure"}</span>
            </Link>
        );
    }
}

ConfigureMenu.displayName = "ConfigureMenu";
