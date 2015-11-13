"use strict";
import React, { Component, PropTypes } from "react";
import { Route, Link } from "react-router";

export default
class AllCategories extends Component {

    constructor(props) {
        super( props );

        this.state = {
            "categories": [{ name: "Default Category" }, { name: "Category B" }, { name: "Category C" }, { name: "Category D" }]
        };
    }

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

                        {this.state.categories.map((category, index) =>
                            <li className="category">
                                <Link key={index} to="/configure/category">
                                    <div className="v-center t-center">
                                        <span>{category.name}</span>
                                    </div>
                                </Link>
                            </li>
                        )}
                    </ul>
                </div>
            </div>
        );
    }
}


AllCategories.displayName = "All categories";


