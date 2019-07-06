import LogoutActions from "./../../js/login/LogoutActions";
import React, { Component } from "react";
import { Link } from "react-router";
import Locale from "./../utils/Locale";

export default class UserProfile extends Component {

    _logout() {
        LogoutActions.instance().logout();
    }

    render() {
        const userProfileStrings = Locale.applicationStrings().messages.userProfileStrings;
        return (
            <ul className="user-profile--dropdown">
                <li className="user-profile--change-password">
                    <Link to="/change-password">{userProfileStrings.changePassword}</Link>
                </li>
                <li className="user-profile--logout">
                    <a onClick={this._logout}>{userProfileStrings.logout}</a>
                </li>
            </ul>
        );
    }
}
