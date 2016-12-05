/* eslint react/jsx-no-literals:0 */
import React, { Component } from "react";

export default class UserProfile extends Component {

    render() {
        return (
            <div>
                <ul>
                    <li className="user-profile--dropdown__item">Change Password</li>
                    <li className="user-profile--dropdown__item">Help & FAQs</li>
                    <li className="user-profile--dropdown__item">Logout</li>
                </ul>
            </div>
        );
    }
}
