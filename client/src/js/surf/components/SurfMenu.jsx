"use strict";
import React, { Component } from "react";
import { Link } from "react-router";

export default class SurfMenu extends Component {
    render() {
        return (
            <Link to="/surf" activeClassName="selected">
                <div className= "surf header-link-image"></div>
                <span>{"Surf"}</span>
            </Link>
        );
    }
}

SurfMenu.displayName = "SurfMenu";
