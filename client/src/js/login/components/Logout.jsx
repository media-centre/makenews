"use strict";
import React, { Component } from "react";
import { Link } from "react-router";


export default class Logout extends Component {
    _logout() {
        localStorage.setItem("userInfo", "");
    }

    render() {
        return (
            <Link to="/" onClick={this._logout} className="link highlight-on-hover">
                <span>{"Logout"}</span>
            </Link>
        );
    }
}

Logout.displayName = "Logout";
