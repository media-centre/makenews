"use strict";
import React, { Component, PropTypes } from "react";
import { Route, Link } from "react-router";
import { connect } from "react-redux";
import { displayAllCategoriesAsync } from "../../actions/config/AllCategoriesActions.js";


export default
class AllCategories extends Component {
    render() {
        return (
            <div className="configure-page max-width">
                <h4 className="t-center">
                    {"All categories"}
                </h4>
                <div className="categories">
                    <ul className="cat-list m-t-center">

                        <li className="add-new">
                            <Link to="/configure/category">
                                <div className="v-center t-center">
                                    <span>{"Add new category"}</span>
                                </div>
                            </Link>
                        </li>

                        {this.props.categories.map((category, index) =>
                            <li key={index} className="category">
                                <Link to={"/configure/category/" + category}>
                                    <div className="v-center t-center">
                                        <span>{category}</span>
                                    </div>
                                </Link>
                            </li>
                        )}
                    </ul>
                </div>
            </div>
        );
    }

    componentDidMount() {
        this.props.dispatch(displayAllCategoriesAsync());
    }

}


AllCategories.displayName = "All categories";

function select(store) {
    return store.allCategories;
}
export default connect(select)(AllCategories);

