/* eslint brace-style:0 */
"use strict";
import React, { Component, PropTypes } from "react";
import logout from "../../login/components/Logout.jsx";
import { logout } from "../LogoutActions";


export default class UserProfile extends Component {

    constructor(props) {
        super(props);
        this.state = { "show": false };
    }

    toggleDropdown() {
        this.setState({ "show": !this.state.show });
    }

    render() {
        return (
            <div>
                <h4 className="user-info-label" onClick={this.toggleDropdown.bind(this)}>{"Settings"}</h4>
                <div className={this.state.show ? "drop-down" : "drop-down hide"}>
                    <ul>
                        <li ref="updateProfile">{"Update Profile"}</li>
                        <li ref="logout">{"Logout"}<logout /></li>
                    </ul>
                </div>
            </div>
        );
    }
}

UserProfile.displayName = "UserProfile";
