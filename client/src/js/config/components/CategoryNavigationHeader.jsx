/* eslint no-unused-vars:0, max-len:0 */
"use strict";
import CategoryDb from "../db/CategoryDb";
import React, { Component, PropTypes } from "react";
import { Route, Link, History } from "react-router";
import { connect } from "react-redux";

export default class CategoryNavigationHeader extends Component {

    _validateCategoryTitle(event, props) {
        var categoryName = this.refs.categoryTitleElement.textContent.trim();
        if (categoryName.toLowerCase() !== this.props.categoryName.toLowerCase()) {
            props.updateCategoryName(categoryName);
        }
    }

    _handleEnterKey(event, props) {
        const ENTERKEY = 13;
        if (event.keyCode === ENTERKEY) {
            event.preventDefault();
            this.refs.categoryTitleElement.blur(event, props);
        }

    }

    _highlightEditableTitle() {
        return this.props.isValidName ? "t-center trans-border t-bold category-title" : "t-center t-bold error-border category-title";
    }

    handleDelete(categoryName, categoryId) {
        let confirm = window.confirm(categoryName + " Category will be permanently deleted. You will not get feeds from this category.");//eslint-disable-line no-alert
        if(confirm) {
            CategoryDb.deleteCategory(categoryId).then((result) => {
                this.context.history.push("/configure/categories");
            });
        }
    }

    render() {
        let titleElement = this.props.isDefault ? <div className="navigation-title t-center m-block" id="categoryTitle">{this.props.categoryName}</div>
            : <div className="navigation-title t-center m-block custom-category-name">
            <div className={this._highlightEditableTitle()} id="categoryTitle" ref="categoryTitleElement" contentEditable onKeyDown={(event)=> this._handleEnterKey(event, this.props)} onMouseOut={(event)=> this._validateCategoryTitle(event, this.props)} onBlur={(event)=> this._validateCategoryTitle(event, this.props)}>
                    {this.props.categoryName}
            </div>
            <div className={this.props.isValidName ? "title-status t-center" : "title-status error-msg t-center"}>{this.props.errorMessage}</div>
        </div>;
        let deleteElement = this.props.isDefault ? null : <button className="delete-category right" id="deleteCategory" ref="deleteCategoryLinkLabel" onClick = {(event) => this.handleDelete(this.props.categoryName, this.props.categoryId)}>{this.props.categoryDetailsPageStrings.deleteCategoryLinkLabel}</button>;
        return (

            <div className="navigation-header clear-fix">
                <Link to="/configure/categories" className="navigation nav-control h-center left" id="allCategoriesButton">
                    <i className="fa fa-arrow-left"></i>
                    <span ref="allCategoriesLinkLabel">{this.props.categoryDetailsPageStrings.allCategoriesLinkLabel}</span>
                </Link>
                {deleteElement}
                {titleElement}
            </div>
        );
    }

}


CategoryNavigationHeader.displayName = "Category Navigation Header";

CategoryNavigationHeader.propTypes = {
    "categoryName": PropTypes.string,
    "categoryId": PropTypes.string,
    "editableHeader": PropTypes.bool,
    "isDefault": PropTypes.bool,
    "errorMessage": PropTypes.string,
    "categoryDetailsPageStrings": PropTypes.object.isRequired,
    "isValidName": PropTypes.bool
};

CategoryNavigationHeader.defaultProps = {
    "categoryName": "",
    "editableHeader": false,
    "isDefault": false,
    "errorMessage": "",
    "isValidName": true
};

CategoryNavigationHeader.contextTypes = {
    "history": History.prototype
};

