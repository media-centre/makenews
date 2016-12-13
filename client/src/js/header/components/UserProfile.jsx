/* eslint react/jsx-no-literals:0 */
import LogoutActions from "../../login/LogoutActions";
import React, { Component } from "react";

export default class UserProfile extends Component {

    _logout() {
        LogoutActions.instance().logout();
    }

    render() {
        return (
            <div>
                <ul className="user-profile--dropdown">
                    <li className="user-profile--change-password">Change Password</li>
                    <li className="user-profile--help">Help & FAQs</li>
                    <li className="user-profile--logout" onClick={this._logout}>Logout</li>
                </ul>
            </div>
        );
    }
}
