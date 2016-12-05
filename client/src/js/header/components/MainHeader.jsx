import React, { Component } from "react";
import MainHeaderTabs from "./MainHeaderTabs.jsx";

export default class MainHeader extends Component {
    render() {
        return (
            <div className = "header">

                <div className = "header__logo">
                    <img src=".../../../images/makenews-logo.png"/>
                </div>

                <div>
                    <MainHeaderTabs />
                </div>
            </div>
        );
    }
}
