/* eslint brace-style:0 */
"use strict";

import React, { Component } from "react";

export default class UserProfile extends Component {

    constructor(props) {
        super(props);

        this.state = { "errorMsg": "" };
    }

    submitProfile(event) {
        event.preventDefault();

        if(this.refs.newPassword.value !== this.refs.confirmPassword) {
            this.setState({ "errorMsg": "New password and ConfirmPassword does not match" });
        }

    }

    render() {
        return (
            <div className="user-profile">
                <form className="border" onSubmit={(event) => this.submitProfile(event)}>
                    <h4 className="t-center">{"Change Password"}</h4>
                    <p className="error-msg">{this.state.errorMsg}</p>
                    <div className="row">
                        <input type="password" name="currentPassword" placeholder="Current Password" className="box" required ref="currentPassword"/>
                    </div>
                    <div className="row">
                        <input type="password" name="newPassword" placeholder="New Password" className="box" required ref="newPassword"/>
                    </div>
                    <div className="row">
                        <input type="password" name="confirmPassword" placeholder="Confirm Password" className="box" required ref="confirmPassword"/>
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
