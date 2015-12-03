"use strict";
import React, { Component } from "react";
import { Link } from "react-router";

export default class ParkMenu extends Component {
    render() {
        return (
            <Link to="/park" activeClassName="selected">
                <div className= "park header-link-image"></div>
                <span>{"Park"}</span>
            </Link>
        );
    }
}

ParkMenu.displayName = "ParkMenu";
