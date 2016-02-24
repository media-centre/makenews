/* eslint brace-style:0 */
"use strict";

import React, { Component } from "react";
import Locale from "../utils/Locale";

export default class UserProfile extends Component {

    constructor(props) {
        super(props);
        this.messages = Locale.applicationStrings().messages.userProfile;
        this.state = { "errorMsg": "" };
    }

    submitProfile(event) {
        event.preventDefault();
        //let currentPassword = this.refs.currentPassword.value.trim();
        let newPassword = this.refs.newPassword.value.trim();
        let confirmPassword = this.refs.confirmPassword.value.trim();

        if(newPassword !== confirmPassword) {
            this.setState({ "errorMsg": this.messages.passwordMisMatch });
            return false;
        }

    }

    render() {
        return (
            <div className="user-profile">
                <form className="border" onSubmit={(event) => this.submitProfile(event)}>
                    <h4 className="t-center">{"Change Password"}</h4>
                    <p className="error-msg small-text t-center">{this.state.errorMsg}</p>
                    <div className="row">
                        <input type="password" name="currentPassword" placeholder={this.messages.currentPassword} className="box" required ref="currentPassword"/>
                    </div>
                    <div className="row">
                        <input type="password" name="newPassword" placeholder={this.messages.newPassword} className="box" required ref="newPassword"/>
                    </div>
                    <div className="row">
                        <input type="password" name="confirmPassword" placeholder={this.messages.confirmPassword} className="box" required ref="confirmPassword"/>
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
