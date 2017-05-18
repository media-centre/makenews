import React, { Component } from "react";
import PropTypes from "prop-types";
import {
    changePassword,
    newPasswordShouldNotMatchCurrentPwdAction,
    newPwdConfirmPwdMismatchAction
} from "./UserProfileActions";
import { connect } from "react-redux";
import Logout from "../login/LogoutActions";
import Locale from "./../utils/Locale";
import { popUp } from "./../header/HeaderActions";

export class ChangePassword extends Component {

    constructor(props) {
        super(props);
        this.submitProfile = this.submitProfile.bind(this);
    }

    submitProfile(event) {  //eslint-disable-line consistent-return
        event.preventDefault();
        const currentPassword = this.refs.currentPassword.value.trim();
        const newPassword = this.refs.newPassword.value.trim();
        const confirmPassword = this.refs.confirmPassword.value.trim();

        if(newPassword !== confirmPassword) {
            this.props.dispatch(newPwdConfirmPwdMismatchAction());
            return false;
        }
        if(currentPassword === newPassword) {
            this.props.dispatch(newPasswordShouldNotMatchCurrentPwdAction());
            return false;
        }

        this.props.dispatch(changePassword(currentPassword, newPassword));
    }

    _logout() {
        Logout.instance().logout();
    }

    render() {
        const changePasswordStrings = Locale.applicationStrings().messages.changePassword;
        const errorMessage = this.props.changePasswordMessages.errorMessage;

        if(this.props.changePasswordMessages.isSuccess) {
            this.props.dispatch(popUp(changePasswordStrings.logoutConfirmMessage, this._logout, this.props.changePasswordMessages.isSuccess));
        }

        const currentPasswordError = (errorMessage === changePasswordStrings.invalidCredentials) ? "error-border " : "";
        const newPasswordError = (errorMessage === changePasswordStrings.newPwdShouldNotMatchCurrentPwd) ? "error-border " : "";
        const confirmPasswordError = (errorMessage === changePasswordStrings.newPwdConfirmPwdMismatch) ? "error-border " : "";

        return (
            <div className="change-password">
                <form id="changePassword" onSubmit={this.submitProfile}>
                    <h3>{"Change Password"}</h3>
                    <p className="error-msg small-text">{this.props.changePasswordMessages.errorMessage}</p>
                    <input type="password" name="current password" placeholder={changePasswordStrings.currentPassword} className={currentPasswordError} required ref="currentPassword"/>
                    <input type="password" name="new password" placeholder={changePasswordStrings.newPassword} className={newPasswordError} required ref="newPassword"/>
                    <input type="password" name="confirm password" placeholder={changePasswordStrings.confirmPassword} className={confirmPasswordError} required ref="confirmPassword"/>
                    <button type="submit" className="primary">{"Submit"}</button>
                </form>
            </div>
        );
    }
}

ChangePassword.propTypes = {
    "changePasswordMessages": PropTypes.object.isRequired,
    "dispatch": PropTypes.func.isRequired
};


function select(store) {
    return { "changePasswordMessages": store.changePassword };
}
export default connect(select)(ChangePassword);
