"use strict";
import React, { Component, PropTypes } from "react";
import CategoryNavigationHeader from "./CategoryNavigationHeader.jsx";
import { connect } from "react-redux";
import { createCategory } from "../actions/CategoryActions.js";

export default class NewCategory extends Component {

    _createCategory(event) {
        this.props.dispatch(createCategory(event.target.value, (response)=>  {
            var a = document.createElement("a");
            a.setAttribute("href", "#/configure/category/" + response.id + "/" + event.target.value);
            a.click();
        }));

    }

    render() {
        return (
            <CategoryNavigationHeader title="Create Category" editableHeader={true} validateTitle={(event)=> {this._createCategory(event)}}/>
        );
    }
}


NewCategory.displayName = "New Category";
NewCategory.propTypes = {

};

function select(store) {
    return store;
}
export default connect(select)(NewCategory);


