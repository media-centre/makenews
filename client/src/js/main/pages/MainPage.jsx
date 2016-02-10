/* eslint no-lonely-if:0, no-magic-numbers:0 */
"use strict";
import React, { Component, PropTypes } from "react";
import MainHeader from "../headers/MainHeader.jsx";
import { connect } from "react-redux";

export class MainPage extends Component {

    componentDidMount() {
        window.addEventListener("scroll", this._showScrollToTop);

        this.refs.scrollToTop.addEventListener("click", () => {
            window.scrollTo(0, 0);
        });
    }

    _showScrollToTop() {
        let scrollToTop = document.getElementById("scrollToTop");
        if(scrollToTop === null) {
            return;
        }

        if (window.scrollY > 500) {
            if(scrollToTop.classList.contains("hide")) {
                scrollToTop.classList.remove("hide");
            }
        } else {
            if(!scrollToTop.classList.contains("hide")) {
                scrollToTop.classList.add("hide");
            }
        }
    }

    componentWillUnmount() {
        window.removeEventListener("scroll", this.scrollToTop);
    }

    render() {
        return (
            <div className="main-page">
                <MainHeader ref="header" headerStrings={this.props.headerStrings} highlightedTab={this.props.highlightedTab} parkCounter={this.props.parkCounter}/>
                <section>{this.props.children}</section>
                <div id="scrollToTop" ref="scrollToTop" className="hide">
                    <i className = "fa fa-arrow-up"></i>
                </div>
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
