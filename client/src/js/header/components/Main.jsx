import React, { Component } from "react";
import PropTypes from "prop-types";
import Header from "./Header";
import { connect } from "react-redux";

export class Main extends Component {
    render() {
        return (
            <div>
                <div className = "header">
                    <div className = "header__logo">
                        <img src="./images/makenews-logo.png"/>
                    </div>
                        <Header mainHeaderStrings={this.props.mainHeaderStrings} currentHeaderTab={this.props.currentHeaderTab}/>
                </div>
                <section className="main">{this.props.children}</section>
            </div>
        );
    }
}

Main.propTypes = {
    "children": PropTypes.node,
    "mainHeaderStrings": PropTypes.object.isRequired,
    "currentHeaderTab": PropTypes.string.isRequired,
    "dispatch": PropTypes.func.isRequired
};

function select(store) {
    return { "mainHeaderStrings": store.mainHeaderStrings, "currentHeaderTab": store.currentHeaderTab };
}

export default connect(select)(Main);
