/*eslint react/prefer-es6-class:0*/
"use strict";
import React, { PropTypes } from "react";
import { History, Link } from "react-router";
import { connect } from "react-redux";
import { displayAllCategoriesAsync } from "../actions/AllCategoriesActions.js";
import { highLightTabAction } from "../../tabs/TabActions.js";
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

    mixins: [History], //eslint-disable-line quote-props

    componentWillMount() {
        window.scrollTo(0, 0);
        this.props.dispatch(highLightTabAction("Configure"));
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
                    <span ref="addNewCategoryLink">{this.props.allCategoriesPageStrings.addNewCategoryLabel}</span>
                </div>
            </div>
        </li>);
        this.props.allCategories.categories.map((category, index) =>
            categoriesArray.push(
                <li key={index + 1} className="category">
                    <Link ref={"categoryLink_" + category._id} to={"/configure/category/" + category._id + "/" + category.name} className="navigation-link">
                        <div className="v-center t-center text-container">
                            <span ref={"category_" + category._id}>{category.name}</span>
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
                <h3 ref="allCategoriesHeading" className="t-center t-bold">
                    {this.props.allCategoriesPageStrings.allCategoriesHeading}
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

export { AllCategories };

function select(store) {
    return { "allCategories": store.allCategories, "allCategoriesPageStrings": store.configurePageLocale.allCategories };
}
export default connect(select)(AllCategories);

