"use strict";
import React, { Component } from "react";

export default class Logo extends Component {
    render() {
        return (
            <div className="app-logo-container">
                <img src="images/main/makenews.png" className="app-logo left clear-fix" ref="logo"/>
            </div>
        );
    }
}

Logo.displayName = "Logo Component";
