/* eslint react/jsx-no-literals:0 */
import LogoutActions from "./../../js/login/LogoutActions";
import React, { Component, PropTypes } from "react";
import { Link } from "react-router";
import { connect } from "react-redux";

export class UserProfile extends Component {

    _logout() {
        LogoutActions.instance().logout();
    }

    render() {
        return (
            <ul className="user-profile--dropdown">
                <li className="user-profile--change-password">
                    <Link to="/change-password">{this.props.userProfileStrings.changePassword}</Link>
                </li>
                <li className="user-profile--help">
                    <Link to="/help">{this.props.userProfileStrings.help}</Link>
                </li>
                <li className="user-profile--logout">
                    <a onClick={this._logout}>{this.props.userProfileStrings.logout}</a>
                </li>
            </ul>
        );
    }
}

UserProfile.propTypes = {
    "userProfileStrings": PropTypes.object.isRequired
};

function select(store) {
    return { "userProfileStrings": store.userProfileStrings };
}
export default connect(select)(UserProfile);

