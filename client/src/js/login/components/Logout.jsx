"use strict";
import React, { Component, PropTypes } from "react";
import DbSession from "../../../../src/js/db/DbSession.js";
import { Link } from "react-router";


export default class Logout extends Component {
    _logout() {
        localStorage.setItem("userInfo", "");
        DbSession.clearInstance();
    }

    render() {
        return (
            <Link to="/" onClick={this._logout} className="link highlight-on-hover">
                <span ref="logoutLabel">{this.props.logoutButton.Name}</span>
            </Link>
        );
    }
}

Logout.displayName = "Logout";
Logout.propTypes = {
    "logoutButton": PropTypes.object.isRequired
};
