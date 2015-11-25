
/* eslint no-unused-vars:0 */
"use strict";
import React, { Component, PropTypes } from "react";
import { Route, Link } from "react-router";
import { connect } from "react-redux";

export default class CategoryNavigationHeader extends Component {

    _validateCategoryTitle(event, props) {
        var categoryName = this.refs.categoryTitleElement.textContent.trim();
        if(categoryName.toLowerCase() !== this.props.categoryName.toLowerCase()) {
            props.updateCategoryName(categoryName);
        }
    }

    render() {

        let titleElement = this.props.isDefault ?  <div className="navigation-title t-center m-block" id="categoryTitle">{this.props.categoryName}</div> : <div className="navigation-title t-center m-block" id="categoryTitle" ref="categoryTitleElement" contentEditable onBlur={(event)=> this._validateCategoryTitle(event, this.props)}>{this.props.categoryName}</div>
        let deleteElement = this.props.isDefault ?  null : <button className="delete-category right" id="deleteCategory">{"Delete Category"}</button>

        return (

            <div className="navigation-header clear-fix">
                <Link to="/configure/categories" className="navigation nav-control h-center left" id="allCategoriesButton">
                    <i className="fa fa-arrow-left"></i><span>{"All Categories"}</span>
                </Link>
                {deleteElement}
                {titleElement}
                <div className="error-msg error t-center">{this.props.errorMessage}</div>

            </div>
        );
    }

}


CategoryNavigationHeader.displayName = "Category Navigation Header";

CategoryNavigationHeader.propTypes = {
    "categoryName": PropTypes.string,
    "editableHeader": PropTypes.bool,
    "isDefault": PropTypes.bool,
    "errorMessage": PropTypes.string
};

CategoryNavigationHeader.DefaultProps = {
    "categoryName": "",
    "editableHeader": false,
    "isDefault": false,
    "errorMessage": ""
};


