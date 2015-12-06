"use strict";
import React, { Component, PropTypes } from "react";
import { Link } from "react-router";

export default class ParkMenu extends Component {
    render() {
        return (
            <Link to="/park" activeClassName="selected">
                <div className= "park header-link-image"></div>
                <span ref="parkTabName">{this.props.parkTab.Name}</span>
            </Link>
        );
    }
}

ParkMenu.displayName = "ParkMenu";
ParkMenu.propTypes = {
    "parkTab": PropTypes.object.isRequired
};

