"use strict";
import React, { Component, PropTypes } from "react";
import MainHeader from "../headers/MainHeader.jsx";
import { initialiseParkedFeedsCount } from "../../feeds/actions/FeedsActions.js";
import { connect } from "react-redux";

export class MainPage extends Component {
    componentWillMount() {
        this.props.dispatch(initialiseParkedFeedsCount());
    }

    render() {
        return (
            <div className="main-page">
                <MainHeader ref="header" headerStrings={this.props.headerStrings} highlightedTab={this.props.highlightedTab} parkCounter={this.props.parkCounter}/>
                <section>{this.props.children}</section>
            </div>
        );
    }
}


MainPage.displayName = "MainPage";
MainPage.propTypes = {
    "children": PropTypes.node,
    "headerStrings": PropTypes.object.isRequired,
    "highlightedTab": PropTypes.object.isRequired,
    "parkCounter": PropTypes.number.isRequired,
    "dispatch": PropTypes.func.isRequired
};

function select(store) {
    return { "highlightedTab": store.highlightedTab, "headerStrings": store.mainHeaderLocale, "parkCounter": store.parkCounter };
}

export default connect(select)(MainPage);
