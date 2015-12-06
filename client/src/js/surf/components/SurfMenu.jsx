"use strict";
import React, { Component, PropTypes } from "react";
import { Link } from "react-router";

export default class SurfMenu extends Component {
    render() {
        return (
            <Link to="/surf" activeClassName="selected">
                <div className= "surf header-link-image"></div>
                <span ref="surfTabName">{this.props.surfTab.Name}</span>
            </Link>
        );
    }
}

SurfMenu.displayName = "SurfMenu";
SurfMenu.propTypes = {
    "surfTab": PropTypes.object.isRequired
};

