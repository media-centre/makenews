"use strict";
import React, { Component, PropTypes } from "react";
import { Route, Link } from "react-router";
import { connect } from "react-redux";

export default
class AllCategories extends Component {

    //constructor(props) {
        //super(props);
        //this.state = {
        //    "categories": [{ name: "Default Category" }, { name: "Category B" }, { name: "Category C" }, { name: "Category D" }]
        //};
    //}

    render() {
        console.log("start.....");
        console.log(this.props.categories);
        this.props.categories.map(function(category, index){
            console.log("key = " + category);
            console.log("index = " + index);
        });
        console.log("end.....");

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
                            <li className="category">
                                <Link key={index} to={"/configure/category/" + category}>
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
}


AllCategories.displayName = "All categories";

function select(store) {
    return store.allCategories;
}
export default connect(select)(AllCategories);

