/* eslint react/no-set-state:0 */

"use strict";
import React, { Component, PropTypes } from "react";
import { Link } from "react-router";

export default class MainHeaderTab extends Component {
    render() {
        const NOT_FOUND_INDEX = -1;
        let counter = null;

        if(this.props.className === "park") {
            counter = <i className="counter">{this.props.parkCounter}</i>;
        }
        return (
            <li>
                <Link to={this.props.url} className={(this.props.tabToHighlight.tabNames.indexOf(this.props.name) === NOT_FOUND_INDEX) ? "" : "selected"} >
                    {counter}
                    <div className={this.props.className + " header-link-image"}></div>
                    <span>{this.props.name}</span>
                </Link>
            </li>
        );
    }
}

MainHeaderTab.displayName = "MainHeaderTab";

MainHeaderTab.propTypes = {
    "name": PropTypes.string.isRequired,
    "url": PropTypes.string.isRequired,
    "tabToHighlight": PropTypes.object.isRequired,
    "className": PropTypes.string.isRequired,
    "parkCounter": PropTypes.number
};
