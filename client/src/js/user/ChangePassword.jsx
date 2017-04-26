import React, { Component } from "react";
import PropTypes from "prop-types";
import {
    changePassword,
    newPasswordShouldNotMatchCurrentPwdAction,
    newPwdConfirmPwdMismatchAction
} from "./UserProfileActions";
import { connect } from "react-redux";
import ConfirmPopup from "../utils/components/ConfirmPopup/ConfirmPopup";
import Logout from "../login/LogoutActions";
import Locale from "./../utils/Locale";

export class ChangePassword extends Component {

    constructor(props) {
        super(props);
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
        const popUp = this.props.changePasswordMessages.isSuccess
            ? (<ConfirmPopup
                ref="confirmPopup"
                description= {changePasswordStrings.logoutConfirmMessage}
                hide = {this.props.changePasswordMessages.isSuccess}
                callback={() => {
                    this._logout();
                }}
               />)
            : null;

        const currentPasswordError = (errorMessage === changePasswordStrings.invalidCredentials) ? "error-border " : "";
        const newPasswordError = (errorMessage === changePasswordStrings.newPwdShouldNotMatchCurrentPwd) ? "error-border " : "";
        const confirmPasswordError = (errorMessage === changePasswordStrings.newPwdConfirmPwdMismatch) ? "error-border " : "";

        return (
            <div className="change-password">
                <form id="changePassword" onSubmit={(event) => this.submitProfile(event)}>
                    <h3>{"Change Password"}</h3>
                    <p className="error-msg small-text">{this.props.changePasswordMessages.errorMessage}</p>
                    <input type="password" name="current password" placeholder={changePasswordStrings.currentPassword} className={currentPasswordError} required ref="currentPassword"/>
                    <input type="password" name="new password" placeholder={changePasswordStrings.newPassword} className={newPasswordError} required ref="newPassword"/>
                    <input type="password" name="confirm password" placeholder={changePasswordStrings.confirmPassword} className={confirmPasswordError} required ref="confirmPassword"/>
                    <button type="submit" className="primary">{"Submit"}</button>
                </form>
                {popUp}
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
