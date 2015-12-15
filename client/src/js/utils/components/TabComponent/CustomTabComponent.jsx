/* eslint react/no-set-state:0 */

"use strict";
import React, { Component, PropTypes } from "react";
import { Link } from "react-router";
import { highLightTabAction } from "../../../tabs/TabActions.js"

export default class CustomTabComponent extends Component {
    render() {
        return (
            <li>
                <Link to={this.props.url} className={(this.props.tabToHighlight === this.props.name) ? "selected" : ""} >
                    <div className= "configure header-link-image"></div>
                    <span ref="configureTabName">{this.props.name}</span>
                </Link>
            </li>
        );
    }
}

CustomTabComponent.displayName = "CustomTabComponent";

CustomTabComponent.propTypes = {
    "name": PropTypes.string.isRequired,
    "url": PropTypes.string.isRequired,
    "tabToHighlight": PropTypes.string
};
