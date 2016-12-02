import React, { Component } from "react";
import MainHeaderTabs from "./MainHeaderTabs.jsx";

export default class MainHeader extends Component {
    render() {
        return (<div className = "main-header">

            <div className = "main-header__logo">
                <img src=".../../../images/makenews-logo.png"/>
            </div>

            <div className="main-header__tabs">
                <MainHeaderTabs />
            </div>
        </div>);
    }
}
