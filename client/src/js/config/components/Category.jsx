/*eslint max-len:0*/
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
              <CategoryNavigationHeader categoryName={this.props.params.categoryName} isDefault={this.state.isDefaultCategory} updateCategoryName={this._updateCategoryName.bind(this)} errorMessage={this.state.titleErrorMessage} categoriyDetailsPageStrings={this.props.categoryDetailsPageStrings}/>

              <TabControl categoriyDetailsPageStrings={this.props.categoryDetailsPageStrings}>
                  {Object.keys(this.props.categoryDetails.sources).map((key, index) =>
                      <TabContent key={index} content={this.props.categoryDetails.sources[key].details} title={this.props.categoryDetails.sources[key].name} categoryId={this.props.params.categoryId} dispatch={this.props.dispatch} categoriyDetailsPageStrings={this.props.categoryDetailsPageStrings}/>
                  )}
              </TabControl>

          </div>
      );
    }
}


Category.displayName = "Category";
Category.propTypes = {
    "categoryDetails": PropTypes.object.isRequired,
    "dispatch": PropTypes.func.isRequired,
    "params": PropTypes.object,
    "params.categoryType": PropTypes.string,
    "categoryDetailsPageStrings": PropTypes.object.isRequired
};

function select(store) {
    return { "categoryDetails": store.categoryDetails, "categoryDetailsPageStrings": store.configurePageLocale.categoryDetailsPage };
}
export default connect(select)(Category);


