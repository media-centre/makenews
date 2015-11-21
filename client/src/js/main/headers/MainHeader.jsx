/* eslint no-unused-vars:0*/
"use strict";
import React, { Component } from "react";
import { Route, Link } from "react-router";

const ACTIVE_CLASS = "selected";


export default class MainHeader extends Component {

    _logout() {
        localStorage.setItem("userInfo", "");
    }

    render() {
        let linkCollection = [
                    { "path": "/configure/categories", "name": "Configure" },
                    { "path": "/surf", "name": "Surf" },
                    { "path": "/park", "name": "Park" }];

        let linksDom = linkCollection.map((link, index) =>
                        <li key={index}>
                           <Link to={link.path} activeClassName={ACTIVE_CLASS}>
                               <div className={link.name.toLowerCase() + " header-link-image"}></div>
                               <span>{link.name}</span>
                           </Link>
                       </li>
                   );

        return (
            <header>
                <div className="fixed-header clear-fix multi-column">

                    <img src="images/main/makenews.png" className="app-logo left clear-fix m-none"/>

                    <div className="user-info right">
                        <Link to="/" onClick={this._logout} className="link highlight-on-hover">
                            <span>{"Logout"}</span>
                        </Link>
                    </div>

                    <div className="flexible t-center">
                        <ul className="menu-list">
                            {linksDom}
                        </ul>
                    </div>

                </div>

            </header>
        );
    }
}

MainHeader.displayName = "Main Header";


