import React, { PropTypes, Component } from "react";
import {
    changePassword,
    newPasswordShouldNotMatchCurrentPwdAction,
    newPwdConfirmPwdMismatchAction
} from "./UserProfileActions";
import { connect } from "react-redux";
import ConfirmPopup from "../utils/components/ConfirmPopup/ConfirmPopup";
import Logout from "../login/LogoutActions";

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
        const errorMessage = this.props.changePasswordMessages.errorMessage;
        const popUp = this.props.changePasswordMessages.isSuccess
            ? (<ConfirmPopup
                ref="confirmPopup"
                description= {this.props.changePasswordStrings.logoutConfirmMessage}
                hide = {this.props.changePasswordMessages.isSuccess}
                callback={() =>{ this._logout(); }} //eslint-disable-line brace-style
               />)
            : null;

        const currentPasswordError = (errorMessage === this.props.changePasswordStrings.invalidCredentials) ? "error-border " : "";
        const newPasswordError = (errorMessage === this.props.changePasswordStrings.newPwdShouldNotMatchCurrentPwd) ? "error-border " : "";
        const confirmPasswordError = (errorMessage === this.props.changePasswordStrings.newPwdConfirmPwdMismatch) ? "error-border " : "";

        return (
            <div className="change-password">
                <form id="changePassword" onSubmit={(event) => this.submitProfile(event)}>
                    <h3>{"Change Password"}</h3>
                    <p className="error-msg small-text">{this.props.changePasswordMessages.errorMessage}</p>
                    <input type="password" name="current password" placeholder={this.props.changePasswordStrings.currentPassword} className={currentPasswordError} required ref="currentPassword"/>
                    <input type="password" name="new password" placeholder={this.props.changePasswordStrings.newPassword} className={newPasswordError} required ref="newPassword"/>
                    <input type="password" name="confirm password" placeholder={this.props.changePasswordStrings.confirmPassword} className={confirmPasswordError} required ref="confirmPassword"/>
                    <button type="submit" className="primary">{"Submit"}</button>
                </form>
                {popUp}
            </div>
        );
    }
}

ChangePassword.propTypes = {
    "changePasswordMessages": PropTypes.object.isRequired,
    "changePasswordStrings": PropTypes.object.isRequired,
    "dispatch": PropTypes.func.isRequired
};


function select(store) {
    return { "changePasswordMessages": store.changePassword, "changePasswordStrings": store.changePasswordStrings };
}
export default connect(select)(ChangePassword);
