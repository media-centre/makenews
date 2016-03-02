/* eslint brace-style:0 */
"use strict";

import React, { PropTypes, Component } from "react";
import AppSessionStorage from "../utils/AppSessionStorage.js";
import UserProfileActions from "./UserProfileActions.js";
import { connect } from "react-redux";
import ConfirmPopup from "../utils/components/ConfirmPopup/ConfirmPopup.js";
import Logout from "../login/LogoutActions";

export class UserProfile extends Component {

    constructor(props) {
        super(props);
    }

    componentWillMount() {
        window.scrollTo(0, 0);
    }

    submitProfile(event) {
        event.preventDefault();
        let currentPassword = this.refs.currentPassword.value.trim();
        let newPassword = this.refs.newPassword.value.trim();
        let confirmPassword = this.refs.confirmPassword.value.trim();

        let userProfileActions = UserProfileActions.instance();
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

    _logout() {
        Logout.instance().logout();
    }

    render() {
        let errorMessage = this.props.changePasswordMessages.errorMessage;
        let popUp = this.props.changePasswordMessages.isSuccess
            ? <ConfirmPopup ref="confirmPopup" description= {this.props.userProfileStrings.logoutConfirmMessage} hide = {this.props.changePasswordMessages.isSuccess} callback={() =>{ this._logout(); }}/> : null;

        let currentPasswordError = (errorMessage === this.props.userProfileStrings.invalidCredentials) ? "error-border box " : "box";
        let newPasswordError = (errorMessage === this.props.userProfileStrings.newPwdShouldNotMatchCurrentPwd) ? " error-border box " : "box";
        let confirmPasswordError = (errorMessage === this.props.userProfileStrings.newPwdConfirmPwdMismatch) ? "error-border box " : "box";

        return (
            <div className="user-profile">
                <form className="border" onSubmit={(event) => this.submitProfile(event)}>
                    <h4 className="t-center">{"Change Password"}</h4>
                    <p className="error-msg small-text t-center">{this.props.changePasswordMessages.errorMessage}</p>
                    <div className="row">
                        <input type="password" name="currentPassword" placeholder={this.props.userProfileStrings.currentPassword} className={currentPasswordError} required ref="currentPassword"/>
                    </div>
                    <div className="row">
                        <input type="password" name="newPassword" placeholder={this.props.userProfileStrings.newPassword} className={newPasswordError} required ref="newPassword"/>
                    </div>
                    <div className="row">
                        <input type="password" name="confirmPassword" placeholder={this.props.userProfileStrings.confirmPassword} className={confirmPasswordError} required ref="confirmPassword"/>
                    </div>
                    <div className="row">
                        <button className="btn-secondary">{"Submit"}</button>
                    </div>
                </form>
                {popUp}
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

