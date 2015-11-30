"use strict";
import React, { PropTypes } from "react";
import { History, Link } from "react-router";
import { connect } from "react-redux";
import { displayAllCategoriesAsync } from "../actions/AllCategoriesActions.js";
import { createCategory } from "../actions/CategoryActions.js";

let AllCategories = React.createClass({
    displayName() {
        return "All Categories";
    },
    propTypes() {
        return {
            "categories": PropTypes.object.isRequired,
            "dispatch": PropTypes.func.isRequired
        };
    },

    mixins: [History],

    componentWillMount() {
        this.props.dispatch(displayAllCategoriesAsync());
    },

    _createNewCategory() {
        let history = this.history;
        this.props.dispatch(createCategory("", (response)=>{
            history.push("/configure/category/" + response.id + "/" + response.name);
        }));
    },

    renderCategoryLists() {
        let categoriesArray = [];
        categoriesArray.push(<li className="add-new" id="addNewCategoryButton" key ="0" onClick={this._createNewCategory}>
            <div className="navigation-link">
                <div className="v-center t-center text-container">
                    <span>{"Add new category"}</span>
                </div>
            </div>
        </li>);
        this.props.categories.map((category, index) =>
            categoriesArray.push(
                <li key={index + 1} className="category">
                    <Link to={"/configure/category/" + category._id + "/" + category.name} className="navigation-link">
                        <div className="v-center t-center text-container">
                            <span>{category.name}</span>
                        </div>
                    </Link>
                </li>
            )
        );
        return categoriesArray;
    },

    render() {
        return (
            <div className="configure-page max-width">
                <h3 className="t-center t-bold">
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
});

module.exports = AllCategories;

function select(store) {
    return store.allCategories;
}
export default connect(select)(AllCategories);

