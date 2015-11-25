"use strict";
import React, { Component, PropTypes } from "react";
import { Route, Link } from "react-router";
import { connect } from "react-redux";
import { displayAllCategoriesAsync } from "../actions/AllCategoriesActions.js";
import { createDefaultCategory, createCategory } from "../actions/CategoryActions.js";
import externalNavigation from "../../utils/ExternalNavigation.js";

export class AllCategories extends Component {
    componentWillMount() {
        this.props.dispatch(createDefaultCategory());
    }

    _createNewCategory() {
        this.props.dispatch(createCategory("", (response)=>  {
            externalNavigation("#/configure/category/" + response.id + "/" + response.name);
        }));
    }

    renderCategoryLists() {
        let categoriesArray = [];
        categoriesArray.push(<li className="add-new" id="addNewCategoryButton" key ="0" onClick={this._createNewCategory.bind(this)}>
            <div className="navigation-link">
                <div className="v-center t-center text-container">
                    <span>{"Add new category"}</span>
                </div>
            </div>
        </li>);
        this.props.categories.map((category, index) =>
            categoriesArray.push(
                <li key={index} className="category">
                    <Link to={"/configure/category/" + category._id + "/" + category.name} className="navigation-link">
                        <div className="v-center t-center text-container">
                            <span>{category.name}</span>
                        </div>
                    </Link>
                </li>
            )
        );
        return categoriesArray;
    }

    render() {
        return (
            <div className="configure-page max-width">
                <h3 className="t-center">
                    {"All Categories"}
                </h3>
                <div className="categories">
                    <ul className="cat-list t-center">
                        {this.renderCategoryLists()}
                    </ul>
                </div>
            </div>
        );
    }
}


AllCategories.displayName = "All categories";
AllCategories.propTypes = {
    "categories": PropTypes.object.isRequired,
    "dispatch": PropTypes.func.isRequired
};

function select(store) {
    return store.allCategories;
}
export default connect(select)(AllCategories);

