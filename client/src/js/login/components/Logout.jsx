"use strict";
import React, { Component, PropTypes } from "react";
import { logout } from "../LogoutActions";
import { Link } from "react-router";


export default class Logout extends Component {
    _logout() {
        logout();
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
