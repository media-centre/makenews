/* eslint react/jsx-no-literals:0 */
import React, { Component } from "react";

export default class UserProfile extends Component {

    render() {
        return (
            <div>
                <ul>
                    <li ref="updateProfile" id="updateProfile">Change Password</li>
                    <li ref="help" id="help">Help & FAQs</li>
                    <li ref="logout" id="logout">Logout</li>
                </ul>
            </div>
        );
    }
}
