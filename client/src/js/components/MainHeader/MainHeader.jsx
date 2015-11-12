"use strict";

import React, { Component, PropTypes } from "react";
import {Route, Link, IndexLink} from "react-router";
import { render } from "react-dom";

const ACTIVE_CLASS = "selected";


export default class MainHeader extends Component {

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
                        <a>{"Logout"}</a>
                    </div>

                    <div className="flexible t-center">
                        <ul className="menu-list">
                            <li>
                                <Link to="/configure/categories" activeClassName={ACTIVE_CLASS}>
                                    <img src="../../../images/newspaper.jpg" />
                                    <span>{"Configure"}</span>
                                </Link>
                            </li>

                            <li>
                                <Link to="/surf" activeClassName={ACTIVE_CLASS}>
                                    <img src="../../../images/newspaper.jpg" />
                                    <span>{"Surf"}</span>
                                </Link>
                            </li>

                            <li>
                                <Link to="/park" activeClassName={ACTIVE_CLASS}>
                                    <img src="../../../images/newspaper.jpg" />
                                    <span>{"Park"}</span>
                                </Link>
                            </li>
                        </ul>
                    </div>

                </div>

            </header>
        );
    }
}

MainHeader.displayName = "Main Header";


