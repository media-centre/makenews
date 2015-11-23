
/* eslint no-unused-vars:0 */
"use strict";
import React, { Component, PropTypes } from "react";
import { Route, Link } from "react-router";

export default class CategoryNavigationHeader extends Component {

    render() {

        let input = this.props.editableHeader ? <input type="text" placeholder="Enter your title" ref="inputTitle" onBlur={this.props.validateTitle} /> : this.props.title;

        return (
            <div className="navigation-header clear-fix">
                <Link to="/configure/categories" className="navigation nav-control h-center left">
                    <i className="fa fa-arrow-left"></i><span>{"All Categories"}</span>
                </Link>
                <h3 className="navigation-title t-center">{input}</h3>
            </div>
        );
    }

}


CategoryNavigationHeader.displayName = "Category Navigation Header";

CategoryNavigationHeader.propTypes = {
    "title": PropTypes.string,
    "editableHeader": PropTypes.bool
};

CategoryNavigationHeader.DefaultProps = {
    "title": "",
    "editableHeader": false
};


