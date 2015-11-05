"use strict";
import React, { Component, PropTypes } from "react";
import {Route, Link} from "react-router";

export default class MainPage extends Component {
    render() {
        return (
            <div className="main-page">
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
                                    <Link to="/configure">
                                        <img src="../../../newspaper.jpg" />
                                        <span>{"Configure"}</span>
                                    </Link>
                                </li>

                                <li>
                                    <Link to="/surf"><img src="../../../newspaper.jpg" />
                                        <span>{"Surf"}</span>
                                    </Link>
                                </li>

                                <li>
                                    <Link to="/park">
                                        <img src="../../../newspaper.jpg" />
                                        <span>{"Park"}</span>
                                    </Link>
                                </li>
                            </ul>
                        </div>

                    </div>

                </header>
                <section>
                {this.props.children}
                </section>
            </div>
        );
    }
}

MainPage.displayName = "MainPage";
MainPage.propTypes = {
    "children": PropTypes.node.isRequired
};
