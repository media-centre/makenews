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
                description= {this.props.userProfileStrings.logoutConfirmMessage}
                hide = {this.props.changePasswordMessages.isSuccess}
                callback={() =>{ this._logout(); }} //eslint-disable-line brace-style
               />)
            : null;

        const currentPasswordError = (errorMessage === this.props.userProfileStrings.invalidCredentials) ? "error-border " : "";
        const newPasswordError = (errorMessage === this.props.userProfileStrings.newPwdShouldNotMatchCurrentPwd) ? "error-border " : "";
        const confirmPasswordError = (errorMessage === this.props.userProfileStrings.newPwdConfirmPwdMismatch) ? "error-border " : "";

        return (
            <div className="change-password">
                <form id="changePassword" onSubmit={(event) => this.submitProfile(event)}>
                    <h3>{"Change Password"}</h3>
                    <p className="error-msg small-text">{this.props.changePasswordMessages.errorMessage}</p>
                    <input type="password" name="current password" placeholder={this.props.userProfileStrings.currentPassword} className={currentPasswordError} required ref="currentPassword"/>
                    <input type="password" name="new password" placeholder={this.props.userProfileStrings.newPassword} className={newPasswordError} required ref="newPassword"/>
                    <input type="password" name="confirm password" placeholder={this.props.userProfileStrings.confirmPassword} className={confirmPasswordError} required ref="confirmPassword"/>
                    <button type="submit" className="primary">{"Submit"}</button>
                </form>
                {popUp}
            </div>
        );
    }
}

ChangePassword.propTypes = {
    "changePasswordMessages": PropTypes.object.isRequired,
    "userProfileStrings": PropTypes.object.isRequired,
    "dispatch": PropTypes.func.isRequired
};


function select(store) {
    return { "changePasswordMessages": store.changePassword, "userProfileStrings": store.userProfileStrings };
}
export default connect(select)(ChangePassword);
