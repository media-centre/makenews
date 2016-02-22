/* eslint brace-style:0 */
"use strict";

import React, { Component, PropTypes } from "react";
import { logout } from "../login/LogoutActions";
import { Link } from "react-router";

export default class UserProfileSettings extends Component {

    constructor(props) {
        super(props);
        this.state = { "show": false };
    }

    toggleDropdown() {
        this.setState({ "show": !this.state.show });
    }

    showProfile() {
        this.toggleDropdown();

    }

    logout() {
        this.toggleDropdown();
        logout();
    }

    render() {
        return (
            <div className="user-settings drop-down">
                <h4 className="user-info-label" onClick={this.toggleDropdown.bind(this)}>{"Settings"}</h4>
                <div className={this.state.show ? "drop-down-wrapper anim bottom-box-shadow" : "drop-down-wrapper anim bottom-box-shadow hide"}>
                    <ul>
                        <li ref="updateProfile" onClick={this.showProfile.bind(this)}>
                            <Link to="/profile" >{"Profile"}</Link>
                        </li>
                        <li ref="logout" onClick={this.logout.bind(this)}>{"Logout"}</li>
                    </ul>
                </div>
            </div>
        );
    }
}

UserProfileSettings.displayName = "UserProfileSettings";
