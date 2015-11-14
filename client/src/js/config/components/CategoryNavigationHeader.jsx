/* eslint no-unused-vars:0 */
"use strict";
import React, { Component } from "react";
import { Route, Link } from "react-router";

export default
class CategoryNavigationHeader extends Component {

    render() {
        return (
            <div className="navigation-header clear-fix">
                <Link to="/configure/categories" className="navigation nav-control h-center left">
                    <i className="fa fa-arrow-left"></i><span>{"All Categories"}</span>
                </Link>
                <h4 className="navigation-title t-center">{this.props.title}</h4>
            </div>
        );
    }

}


CategoryNavigationHeader.displayName = "Category Navigation Header";


