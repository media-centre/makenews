/* eslint react/jsx-no-literals:0 */
import LogoutActions from "../../login/LogoutActions";
import React, { Component } from "react";
import { Link } from "react-router";

export default class UserProfile extends Component {

    _logout() {
        LogoutActions.instance().logout();
    }

    render() {
        return (
            <ul className="user-profile--dropdown">
                <li className="user-profile--change-password">
                    <Link to="/change-password">Change Password</Link>
                </li>
                <li className="user-profile--help">
                    <Link to="/help">Help & FAQs</Link>
                </li>
                <li className="user-profile--logout">
                    <a onClick={this._logout}>Logout</a>
                </li>
            </ul>
        );
    }
}
