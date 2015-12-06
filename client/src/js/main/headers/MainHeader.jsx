/* eslint no-unused-vars:0*/
"use strict";
import ConfigureMenu from "../../config/components/ConfigureMenu.jsx";
import SurfMenu from "../../surf/components/SurfMenu.jsx";
import ParkMenu from "../../park/components/ParkMenu.jsx";
import Logo from "../../utils/components/Logo.jsx";
import Logout from "../../login/components/Logout.jsx";
import React, { Component, PropTypes } from "react";
import { Route, Link } from "react-router";

const ACTIVE_CLASS = "selected";


export default class MainHeader extends Component {

    render() {
        return (
            <header>
                <div className="fixed-header clear-fix multi-column">
                    <Logo ref="logo"/>

                    <div className="user-info right" id="logout">
                        <Logout ref="logout" logoutButton={this.props.headerStrings.logoutButton}/>
                    </div>

                    <div className="flexible t-center">
                        <ul className="menu-list">
                            <li key={0} id="configureLink">
                                <ConfigureMenu ref="configureMenu" configTab={this.props.headerStrings.configTab}/>
                            </li>
                            <li key={1} id="surfLink">
                                <SurfMenu ref="surfMenu" surfTab={this.props.headerStrings.surfTab}/>
                            </li>
                            <li key={2} id="parkLink">
                                <ParkMenu ref="parkMenu" parkTab={this.props.headerStrings.parkTab}/>
                            </li>
                        </ul>
                    </div>
                </div>
            </header>
        );
    }
}

MainHeader.displayName = "Main Header";
MainHeader.propTypes = {
    "headerStrings": PropTypes.object.isRequired
};


