/* eslint no-unused-vars:0*/
"use strict";
import ConfigureMenu from "../../config/components/ConfigureMenu.jsx";
import SurfMenu from "../../surf/components/SurfMenu.jsx";
import ParkMenu from "../../park/components/ParkMenu.jsx";
import Logo from "../../utils/components/Logo.jsx";
import Logout from "../../login/components/Logout.jsx";
import React, { Component } from "react";
import { Route, Link } from "react-router";

const ACTIVE_CLASS = "selected";


export default class MainHeader extends Component {

    render() {
        //let linkCollection = [
        //            { "path": "/configure/categories", "name": "Configure" },
        //            { "path": "/surf", "name": "Surf" },
        //            { "path": "/park", "name": "Park" }];
        //
        //let linksDom = linkCollection.map((link, index) =>
        //                <li key={index} id={link.name.toLowerCase() + "Link"}>
        //                   <Link to={link.path} activeClassName={ACTIVE_CLASS}>
        //                       <div className={link.name.toLowerCase() + " header-link-image"}></div>
        //                       <span>{link.name}</span>
        //                   </Link>
        //               </li>
        //           );
        //
        return (
            <header>
                <div className="fixed-header clear-fix multi-column">
                    <Logo ref="logo"/>

                    <div className="user-info right" id="logout">
                        <Logout ref="logout"/>
                    </div>

                    <div className="flexible t-center">
                        <ul className="menu-list">
                            <li key={0} id="configureLink">
                                <ConfigureMenu ref="configureMenu"/>
                            </li>
                            <li key={1} id="surfLink">
                                <SurfMenu ref="surfMenu"/>
                            </li>
                            <li key={2} id="parkLink">
                                <ParkMenu ref="parkMenu"/>
                            </li>
                        </ul>
                    </div>

                </div>

            </header>
        );
    }
}

MainHeader.displayName = "Main Header";


