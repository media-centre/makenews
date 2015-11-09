"use strict";
import React, { Component, PropTypes } from "react";
import {Route, Link} from "react-router";

export default
class AllCategories extends Component {

    render() {
        return (
            <div className="configure-page">
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


                        <li className="category">
                            <Link to="/configure/category">
                                <div className="v-center t-center">
                                    <span>{"Default Category"}</span>
                                </div>
                            </Link>
                        </li>

                    </ul>
                </div>
            </div>
        );
    }

}


AllCategories.displayName = "All categories";


