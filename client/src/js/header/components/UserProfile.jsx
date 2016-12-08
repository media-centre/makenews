/* eslint react/jsx-no-literals:0 */
import React, { Component } from "react";

export default class UserProfile extends Component {

    render() {
        return (
            <div>
                <ul className="user-profile--dropdown">
                    <li className="user-profile--change-password">Change Password</li>
                    <li className="user-profile--help">Help & FAQs</li>
                    <li className="user-profile--logout">Logout</li>
                </ul>
            </div>
        );
    }
}
