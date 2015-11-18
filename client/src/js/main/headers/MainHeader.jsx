/* eslint no-unused-vars:0*/
"use strict";
import React, { Component } from "react";
import { Route, Link } from "react-router";

const ACTIVE_CLASS = "selected";


export default class MainHeader extends Component {

    _logout() {
        localStorage.setItem("userInfo", "");
    }

    getLinkElements() {
        let linkCollection = [
                    { "path": "/configure/categories", "imageURL": "../../../images/newspaper.jpg", "title": "Configure" },
                    { "path": "/surf", "imageURL": "../../../images/newspaper.jpg", "title": "Surf" },
                    { "path": "/park", "imageURL": "../../../images/newspaper.jpg", "title": "Park" }];
        return linkCollection.map((link) =>
                                           <Link to={link.path} activeClassName={ACTIVE_CLASS}>
                                               <img src={link.imageURL} />
                                               <span>{link.title}</span>
                                           </Link>
                                       );
    }

    render() {
        return (
            <header>
                <div className="fixed-header clear-fix multi-column">

                    <div className="app-logo left clear-fix large-text m-none">
                        <span className="left">
                                {"make"}
                        </span>
                        <b className="left">
                                {"news"}
                        </b>
                    </div>

                    <div className="user-info right">
                        <Link to="/" onClick={this._logout} className="link">{"Logout"}</Link>
                    </div>

                    <div className="flexible t-center">
                        <ul className="menu-list">
                            {this.getLinkElements()}
                        </ul>
                    </div>

                </div>

            </header>
        );
    }
}

MainHeader.displayName = "Main Header";


