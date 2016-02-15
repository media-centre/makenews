/* eslint no-unused-vars:0, max-len:0  */
"use strict";
import CategoryDb from "../db/CategoryDb";
import ConfirmPopup from "../../utils/components/ConfirmPopup/ConfirmPopup";
import React, { Component, PropTypes } from "react";
import { Route, Link, History } from "react-router";
import { connect } from "react-redux";
import Toast from "../../utils/custom_templates/Toast.js";
import FilterFeedsHandler from "../../surf/FilterFeedsHandler.js";

export default class CategoryNavigationHeader extends Component {

    constructor(props, context) {
        super(props, context);
        this.state = {
            "showDeleteConfirm": false
        };
    }

    _updateCategoryName(event, props) {
        var categoryName = this.refs.categoryTitleElement.value;
        props.updateCategoryName(categoryName);
    }

    _handleEnterKey(event, props) {
        const ENTERKEY = 13;
        if (event.keyCode || event.which === ENTERKEY) {
            event.preventDefault();
            this._updateCategoryName(event, props);
        }

    }

    _highlightEditableTitle() {
        return this.props.isValidName ? "t-center trans-border t-bold custom-category-name" : "t-center t-bold error-border custom-category-name";
    }

    showConfirmPopup() {
        this.setDeleteConfirmState(true);
    }

    setDeleteConfirmState(isConfirm) {
        this.setState({ "showDeleteConfirm": isConfirm }); //eslint-disable-line react/no-set-state
    }

    handleDelete(event, categoryId) {
        if(event.OK) {
            CategoryDb.deleteCategory(categoryId).then((result) => {
                Toast.show(`${this.props.categoryName} ${this.props.categoryDetailsPageStrings.successMessages.categoryDeleteSuccess}`);
                this.context.history.push("/configure/categories");
            });
        }
        this.setDeleteConfirmState(false);
    }
    deleteCategory() {
        if(this.props.isDefault) {
            return;
        }

        new FilterFeedsHandler().fetchFilterDocument().then(filterDocs => {
            let found = false;
            if(filterDocs.length !== 0) {
                let filters = filterDocs[0].categories.filter((category) => {
                    if(category.name === this.props.categoryName) {
                        return category;
                    }
                });
                found = filters.length > 0;
            }
            if(found) {
                Toast.show("Selected category in filter cannot be deleted.");
            } else {
                this.showConfirmPopup(this.props.categoryName);
            }
        });
    }
    render() {
        let titleElement = this.props.isDefault ? <div className="navigation-title t-center m-block" id="categoryTitle">{this.props.categoryName}</div>
            : <div className="navigation-title t-center m-block custom-category-name">
            <input defaultValue={this.props.categoryName} type="text" className={this._highlightEditableTitle()} id="categoryTitle" ref="categoryTitleElement" onKeyPress ={(event)=> this._handleEnterKey(event, this.props)} onMouseOut={(event)=> this._updateCategoryName(event, this.props)}>
            </input>
            <div ref="errorMessage" className="title-status error-msg t-center">{this.props.isValidName ? "" : this.props.errorMessage}</div>
        </div>;

        return (
            <div className="navigation-header clear-fix" >
                <Link to="/configure/categories" className="navigation nav-control h-center left" id="allCategoriesButton">
                    <i className="fa fa-arrow-left"></i>
                    <span ref="allCategoriesLinkLabel">{this.props.categoryDetailsPageStrings.allCategoriesLinkLabel}</span>
                </Link>
                <button className={this.props.isDefault ? "delete-category right disable" : "delete-category right"} id="deleteCategory" ref="deleteCategoryLinkLabel" onClick = {(event) => this.deleteCategory()}>{this.props.categoryDetailsPageStrings.deleteCategoryLinkLabel}</button>
                {titleElement}
                {this.state.showDeleteConfirm ? <ConfirmPopup ref="confirmPopup" description= {`${this.props.categoryName} ${this.props.categoryDetailsPageStrings.categoryDeletionConfirm}`} callback={(event) => this.handleDelete(event, this.props.categoryId)} /> : null}
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
    "history": function() {
        return History.prototype;
    }
};
