/* eslint react/jsx-wrap-multilines:0 */
import React, { Component } from "react";

export default class Logo extends Component {
    _func() {
        location.href = "/#/surf";
    }
    render() {
        return (
            <div className="app-logo-container">
                <img src="images/main/makenews.png" className="app-logo left clear-fix" ref="logo" onClick={this._func}/>
            </div>
        );
    }
}

Logo.displayName = "Logo Component";
