"use strict";
import React, { Component, PropTypes } from "react";
import Link from "react-router";

import MainHeader from "../../components/MainHeader/MainHeader.jsx";

export default class MainPage extends Component {
    render() {
        return (
            <div className="main-page">
                <MainHeader />
                <section>{this.props.children}</section>
            </div>
        );
    }
}

MainPage.displayName = "MainPage";
MainPage.propTypes = {
    "children": PropTypes.node.isRequired
};
