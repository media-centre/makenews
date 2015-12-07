"use strict";
import React, { Component, PropTypes } from "react";
import CategoryNavigationHeader from "./CategoryNavigationHeader.jsx";
import TabControl from "./TabControl/TabControl.jsx";
import TabContent from "./TabControl/TabContent.jsx";
import { populateCategoryDetailsAsync, DEFAULT_CATEGORY, updateCategoryName } from "../actions/CategoryActions.js";
import { connect } from "react-redux";

export default class Category extends Component {
    constructor(props) {
        super(props);

        this.state = {
            "isDefaultCategory": this.props.params.categoryName === DEFAULT_CATEGORY,
            "titleErrorMessage": ""
        };
    }

    componentWillMount() {
        this.props.dispatch(populateCategoryDetailsAsync(this.props.params.categoryId));
        window.scrollTo(0, 0);
    }

    _isValidName(categoryName) {
        return categoryName.match(/^[ A-Za-z0-9_-]*$/) !== null;
    }

    _updateCategoryName(categoryName) {
        if(!categoryName) {
            this.setState({ "titleErrorMessage": "Category name can not be empty" });
            return;
        }


        if(this._isValidName(categoryName)) {
            this.props.dispatch(updateCategoryName(categoryName, this.props.params.categoryId, (response)=> {
                this.setState({ "titleErrorMessage": response.status ? "" : "Category name already exists" });
            }));
        } else {
            this.setState({ "titleErrorMessage": "Invalid category name. Use only - or _" });
        }
    }

    render() {
        return (
          <div className="category-page max-width">
              <CategoryNavigationHeader categoryName={this.props.params.categoryName} isDefault={this.state.isDefaultCategory} updateCategoryName={this._updateCategoryName.bind(this)} errorMessage={this.state.titleErrorMessage}/>

              <TabControl>
                  {Object.keys(this.props.sources).map((key, index) =>
                      <TabContent key={index} content={this.props.sources[key].details} title={this.props.sources[key].name} categoryId={this.props.params.categoryId} dispatch={this.props.dispatch}/>
                  )}
              </TabControl>

          </div>
      );
    }
}


Category.displayName = "Category";
Category.propTypes = {
    "categories": PropTypes.node,
    "dispatch": PropTypes.func.isRequired,
    "sources": PropTypes.object.isRequired,
    "params": PropTypes.object,
    "params.categoryType": PropTypes.string
};

function select(store) {
    return store.categoryDetails;
}
export default connect(select)(Category);


