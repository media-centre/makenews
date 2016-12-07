/* eslint react/jsx-no-literals:0 brace-style:0 */
import React, { Component } from "react";
import UserProfile from "./UserProfile";

export default class UserProfileTab extends Component {
    constructor(props) {
        super(props);
        this.state = { "show": false };
    }

    _toggleDropdown() {
        this.setState({ "show": !this.state.show });
    }

    render() {
        return (
            <div className="user-profile" onClick={() => { this._toggleDropdown(); }} onMouseLeave={() => { this._toggleDropdown(); }}>
                        <span className="user-profile__image">
                            <img src="../../../images/userprofile-icon.png"/>
                        </span>
                <span className="user-profile__name">User Profile</span>
                        <span>
                            <i className="fa fa-caret-down down-arrow" aria-hidden="true"/>
                        </span>
                <div className={this.state.show ? "user-profile__dropdown" : "user-profile__dropdown hide"}>
                    <UserProfile />
                </div>
            </div>
        );
    }
}
