/* eslint brace-style:0 */
"use strict";

import React, { PropTypes, Component } from "react";
import AppSessionStorage from "../utils/AppSessionStorage.js";
import UserProfileActions from "./UserProfileActions.js";
import { connect } from "react-redux";

export class UserProfile extends Component {

    constructor(props) {
        super(props);
    }

    submitProfile(event) {
        event.preventDefault();
        let currentPassword = this.refs.currentPassword.value.trim();
        let newPassword = this.refs.newPassword.value.trim();
        let confirmPassword = this.refs.confirmPassword.value.trim();

        let userProfileActions = new UserProfileActions();
        if(newPassword !== confirmPassword) {
            this.props.dispatch(userProfileActions.newPwdConfirmPwdMismatch());
            return false;
        }
        if(currentPassword === newPassword) {
            this.props.dispatch(userProfileActions.newPasswordShouldNotMatchCurrentPwd());
            return false;
        }

        this.props.dispatch(userProfileActions.changePassword(AppSessionStorage.instance().getValue(AppSessionStorage.KEYS.USERNAME), currentPassword, newPassword));
    }

    render() {
        return (
            <div className="user-profile">
                <form className="border" onSubmit={(event) => this.submitProfile(event)}>
                    <h4 className="t-center">{"Change Password"}</h4>
                    <p className="error-msg small-text t-center">{this.props.changePasswordMessages.errorMessage}</p>
                    <div className="row">
                        <input type="password" name="currentPassword" placeholder={this.props.userProfileStrings.currentPassword} className="box" required ref="currentPassword"/>
                    </div>
                    <div className="row">
                        <input type="password" name="newPassword" placeholder={this.props.userProfileStrings.newPassword} className="box" required ref="newPassword"/>
                    </div>
                    <div className="row">
                        <input type="password" name="confirmPassword" placeholder={this.props.userProfileStrings.confirmPassword} className="box" required ref="confirmPassword"/>
                    </div>
                    <div className="row">
                        <button>{"Submit"}</button>
                    </div>
                </form>
            </div>
        );
    }
}

UserProfile.displayName = "UserProfile";

UserProfile.propTypes = {
    "changePasswordMessages": PropTypes.object.isRequired,
    "userProfileStrings": PropTypes.object.isRequired,
    "dispatch": PropTypes.func.isRequired
};


function select(store) {
    return { "changePasswordMessages": store.changePassword, "userProfileStrings": store.userProfileStrings };
}
export default connect(select)(UserProfile);

