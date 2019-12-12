// import React, { Component } from "react";
// import PropTypes from "prop-types";
// import {
//     changePassword,
//     newPasswordShouldNotMatchCurrentPwdAction,
//     newPwdConfirmPwdMismatchAction
// } from "./UserProfileActions";
// import { connect } from "react-redux";
// import Logout from "../login/LogoutActions";
// import Locale from "./../utils/Locale";
// import { popUp } from "./../header/HeaderActions";
import React, { Component } from "react";
import Locale from "../utils/Locale";

export default class UserProfileTab extends Component {

    constructor(props) {
        super(props);
        //this.submitProfile = this.submitProfile.bind(this);
    }
    //
    // submitProfile(event) { //eslint-disable-line consistent-return
    //     event.preventDefault();
    //     const currentPassword = this.refs.currentPassword.value.trim();
    //     const newPassword = this.refs.newPassword.value.trim();
    //     const confirmPassword = this.refs.confirmPassword.value.trim();
    //
    //     if(newPassword !== confirmPassword) {
    //         this.props.dispatch(newPwdConfirmPwdMismatchAction());
    //         return false;
    //     }
    //     if(currentPassword === newPassword) {
    //         this.props.dispatch(newPasswordShouldNotMatchCurrentPwdAction());
    //         return false;
    //     }
    //
    //     this.props.dispatch(changePassword(currentPassword, newPassword));
    // }
    //
    // _logout() {
    //     Logout.instance().logout();
    // }

    render() {
        // const changePasswordStrings = Locale.applicationStrings().messages.changePassword;
        // const errorMessage = this.props.changePasswordMessages.errorMessage;
        //
        // if(this.props.changePasswordMessages.isSuccess) {
        //     this.props.dispatch(popUp(changePasswordStrings.logoutConfirmMessage, this._logout, this.props.changePasswordMessages.isSuccess));
        // }
        //
        // const currentPasswordError = (errorMessage === changePasswordStrings.invalidCredentials) ? "error-border " : "";
        // const newPasswordError = (errorMessage === changePasswordStrings.newPwdShouldNotMatchCurrentPwd) ? "error-border " : "";
        // const confirmPasswordError = (errorMessage === changePasswordStrings.newPwdConfirmPwdMismatch) ? "error-border " : "";
        const adminPanel = Locale.applicationStrings().messages.adminPanel;
        return (
          <div className="admin-panel">
              <h1>{adminPanel.header}</h1>
              <hr></hr>
              <div className="delete-users">
                  <h2>{adminPanel.delete}</h2>
              </div>
              <hr></hr>
              <div className="s">
                  <p className="text">other functions...</p>
              </div>
              <div className="change-apassword">
                      <p className="text">hi</p>
              </div>
          </div>
        );
    }
}
