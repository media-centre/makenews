"use strict";
import React, { Component, PropTypes } from "react";
import MainHeader from "../headers/MainHeader.jsx";
import { connect } from "react-redux";

export class MainPage extends Component {
    render() {
        return (
            <div className="main-page">
                <MainHeader ref="header" headerStrings={this.props.headerStrings} highlightedTab={this.props.highlightedTab}/>
                <section>{this.props.children}</section>
            </div>
        );
    }
}


MainPage.displayName = "MainPage";
MainPage.propTypes = {
    "children": PropTypes.node,
    "headerStrings": PropTypes.object.isRequired,
    "highlightedTab": PropTypes.object.isRequired
};

function select(store) {
    return { "highlightedTab": store.highlightedTab, "headerStrings": store.mainHeaderLocale, "parkCounter": store.parkCounter };
}

export default connect(select)(MainPage);
